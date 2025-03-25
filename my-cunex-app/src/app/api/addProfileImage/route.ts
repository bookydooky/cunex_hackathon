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
    const { images, userId } = body;

    if (!images || images.length === 0 || !userId) {
      return NextResponse.json(
        { error: "No images or user ID provided" },
        { status: 400 }
      );
    }

    // Get the first image URL (assuming single image upload)
    const imageUrl = images[0];

    // Insert profile image for user
    const insertSql = `
        UPDATE users 
        SET profileImageUrl = ? 
        WHERE userId = ?
      `;
    const [result] = (await con.query(insertSql, [imageUrl, userId])) as any;

    return NextResponse.json({
      success: true,
      message: "Profile image updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error processing profile image request:", error);
    return NextResponse.json(
      { error: "Server error processing profile image" },
      { status: 500 }
    );
  } finally {
    await con.end();
  }
}
