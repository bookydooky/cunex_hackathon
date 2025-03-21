import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: NextRequest) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    const { historyId, submittedImageId } = await request.json();

    if (!historyId || !submittedImageId) {
      return NextResponse.json(
        { error: "Invalid request: Missing required fields" },
        { status: 400 }
      );
    }

    // Start transaction
    await con.beginTransaction();

    // Update jobHistory table
    const [jobHistoryUpdate] = await con.query<mysql.ResultSetHeader>(
      "UPDATE jobHistory SET accept = ? WHERE historyId = ?",
      [true, historyId]
    );

    if (jobHistoryUpdate.affectedRows === 0) {
      await con.rollback();
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Update salesParams table: increment jobsSold and totalJobs
    const salesUpdateQuery = `
      UPDATE salesParams sp
      JOIN (SELECT sellerId FROM jobHistory WHERE historyId = ?) jh
      ON sp.userId = jh.sellerId
      SET sp.jobsSold = sp.jobsSold + 1, 
          sp.totalJobs = sp.totalJobs + 1, 
          sp.successRate = (sp.jobsSold + 1) / (sp.totalJobs + 1) * 100
    `;
    await con.query(salesUpdateQuery, [historyId]);

    // Update submittedImages table: mark image as checked
    const [imageUpdate] = await con.query<mysql.ResultSetHeader>(
      "UPDATE submittedImages SET checked = TRUE WHERE submittedImageId = ?",
      [submittedImageId]
    );

    if (imageUpdate.affectedRows === 0) {
      await con.rollback();
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Commit transaction
    await con.commit();

    return NextResponse.json({
      success: true,
      message: "Job Accepted Successfully, Sales Updated",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    await con.rollback();
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await con.end();
  }
}
