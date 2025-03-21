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
    const { images, bannerId } = body;

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const values = images.map((imageUrl: string) => [bannerId, imageUrl]);

    // Use execute() instead of query() for parameterized queries
    const sql = "INSERT INTO images (bannerId, imageURL) VALUES ?";
    const [result]: any = await con.execute(sql, [values]);

    return NextResponse.json({
      success: true,
      message: "Images saved successfully",
      insertedCount: result.affectedRows,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await con.end();
  }
}