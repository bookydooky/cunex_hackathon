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
    const body = await request.json();
    const { images, historyId } = body;

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    // Insert images into the submittedImages table
    const values = images.map((imageUrl: any) => [historyId, imageUrl]);
    const insertSql = "INSERT INTO submittedImages (historyId, imageURL) VALUES ?";
    
    const [insertResult] = await con.query(insertSql, [values]);

    // Update job progress in jobHistory table
    const updateProgressSql = `
      UPDATE jobHistory
      SET progress = progress + 1, accept = NULL
      WHERE historyId = ?
    `;
    await con.query(updateProgressSql, [historyId]);

    return NextResponse.json({
      success: true,
      message: "Images saved and progress updated successfully",
      insertedCount: insertResult.affectedRows,
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
