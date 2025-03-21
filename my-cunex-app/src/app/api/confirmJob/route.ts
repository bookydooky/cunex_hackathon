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
    const { bannerId, userId, sellerId } = body;

    if (!bannerId) {
      return NextResponse.json({ error: "Banner Error" }, { status: 400 });
    }

    const values = [[bannerId, sellerId, userId, new Date(), 0]];
    const sql = `
      INSERT INTO jobHistory (bannerId, sellerId, buyerId, dateSold, progress)
      VALUES ?
    `;

    await con.query(sql, [values]);

    return NextResponse.json({
      success: true,
      message: "Job Added Successfully",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
