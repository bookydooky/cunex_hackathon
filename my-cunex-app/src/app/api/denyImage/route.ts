import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: NextRequest) {
  const { historyId, submittedImageId } = await request.json();

  if (!historyId) {
    return NextResponse.json(
      { error: "Cannot Find Your Work" },
      { status: 400 }
    );
  }

  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    await con.beginTransaction();

    // **1. Update jobHistory (Set accept to FALSE)**
    const updateJobHistory = `
      UPDATE jobHistory 
      SET accept = ? 
      WHERE historyId = ?
    `;
    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    const [jobResult] = await con.query(updateJobHistory, [false, historyId]);

    if ((jobResult as any).affectedRows === 0) {
      throw new Error("Job not found");
    }

    // **2. Update salesParams (Only if progress = 3)**
    const updateSalesParams = `
      UPDATE salesParams sp
      JOIN (
          SELECT sellerId 
          FROM jobHistory 
          WHERE historyId = ? AND progress = 3
      ) jh ON sp.userId = jh.sellerId
      SET sp.totalJobs = sp.totalJobs + 1, 
          sp.successRate = (sp.jobsSold) / (sp.totalJobs + 1) * 100
    `;
    const [salesResult] = (await con.query(updateSalesParams, [
      historyId,
    ])) as any;

    const salesUpdated =
      (salesResult as any).affectedRows > 0
        ? "SalesParams updated"
        : "SalesParams not updated";

    // **3. Mark image as checked**
    const updateImageQuery = `
      UPDATE submittedImages 
      SET checked = TRUE 
      WHERE submittedImageId = ?
    `;
    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    const [imageResult] = await con.query(updateImageQuery, [submittedImageId]);

    if ((imageResult as any).affectedRows === 0) {
      throw new Error("Image not found");
    }

    // **Commit Transaction**
    await con.commit();

    return NextResponse.json({
      success: true,
      message: "Job Denied Successfully, Sales Updated",
      salesStatus: salesUpdated,
    });
  } catch (error: any) {
    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    await con.rollback();
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  } finally {
    await con.end();
  }
}
