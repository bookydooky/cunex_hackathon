import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  // Get the userId from URL search params
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing User" }, { status: 400 });
  }

  try {
    // Query job history with banner and buyer information
    const jobData = `
      SELECT jh.*, jb.bannerName, jb.price, jb.duration,
             u.firstName, u.lastName
      FROM jobHistory jh
      LEFT JOIN jobBanners jb ON jh.bannerId = jb.bannerId
      LEFT JOIN users u ON jh.buyerId = u.userId
      WHERE jh.sellerId = ? AND (COALESCE(jh.accept,-1) = 1 OR (jh.progress = 3 AND COALESCE(jh.accept,-1) = 0))
    `;

    const [rows]:any = await con.query(jobData, [userId]);
    return NextResponse.json({ jobs: rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
