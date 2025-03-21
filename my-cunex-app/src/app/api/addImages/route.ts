import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: NextRequest) {
  const { images, bannerId } = await request.json();

  if (!images || images.length === 0) {
    return NextResponse.json({ error: "No images provided" }, { status: 400 });
  }

  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    // Prepare values to insert into the 'images' table
    const values = images.map((imageUrl: string) => [bannerId, imageUrl]);

    // Insert the image data into the database
    const sql = "INSERT INTO images (bannerId, imageURL) VALUES ?";
    const [result] = await con.query(sql, [values]);

    return NextResponse.json({
      success: true,
      message: "Images saved successfully",
      insertedCount: result.affectedRows,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await con.end();
  }
}
