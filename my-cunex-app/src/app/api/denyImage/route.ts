import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: NextRequest) {
  const { historyId, submittedImageId } = await request.json(); // Get data from the request body

  if (!historyId) {
    return NextResponse.json({ error: "Cannot Find Your Work" }, { status: 400 });
  }

  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    // Start a transaction to ensure data consistency
    await new Promise<void>((resolve, reject) => {
      con.beginTransaction((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    // Update jobHistory table to mark the job as denied
    const updateJobHistory = `
      UPDATE jobHistory SET accept = ? WHERE historyId = ?
    `;
    const [jobResult]:any = await con.query(updateJobHistory, [false, historyId]);

    if (jobResult.affectedRows === 0) {
      await new Promise<void>((resolve, reject) => {
        con.rollback((err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Update salesParams table: adjust totalJobs and successRate
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
    await con.query(updateSalesParams, [historyId]);

    // Update submittedImages table: mark the image as checked
    const updateImageQuery = `
      UPDATE submittedImages
      SET checked = TRUE
      WHERE submittedImageId = ?
    `;
    const [imageResult]:any = await con.query(updateImageQuery, [submittedImageId]);

    if (imageResult.affectedRows === 0) {
      await new Promise<void>((resolve, reject) => {
        con.rollback((err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Commit the transaction if everything succeeds
    await con.commit();

    return NextResponse.json({
      success: true,
      message: "Job Denied Successfully, Sales Updated",
    });

  } catch (error) {
    console.error("Error processing request:", error);
    await new Promise<void>((resolve, reject) => {
      con.rollback((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    }); // Rollback the transaction in case of an error
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await con.end(); // Close the connection
  }
}
