import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing User" }, { status: 400 });
    }

    const q = `
      SELECT jh.historyId, jb.bannerName, u.firstName, u.lastName, 
             si.imageURL, si.submittedImageId
      FROM jobHistory jh
      LEFT JOIN jobBanners jb ON jh.bannerId = jb.bannerId
      LEFT JOIN users u ON jh.sellerId = u.userId
      LEFT JOIN submittedImages si ON jh.historyId = si.historyId
      WHERE jh.buyerId = ? AND si.checked = 0
    `;

    const [result] = await con.query(q, [userId]) as any;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
