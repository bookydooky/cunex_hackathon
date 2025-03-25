import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  const { userId } = await params;

  try {
    // Query to fetch user details
    const userQuery = `
      SELECT u.firstName, u.lastName, u.facultyCode, u.studentYear, 
             f.facultyNameEN, u.profileImageUrl
      FROM users u
      LEFT JOIN faculties f ON u.facultyCode = f.facultyCode
      WHERE u.userId = ?
    `;

    // Query to fetch sales parameters
    const salesQuery = `
      SELECT successRate, jobsSold, rehired, avgResponse, bio, rating 
      FROM salesParams 
      WHERE userId = ?
    `;

    // Fetch user details
    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    const [userResult] = await con.execute(userQuery, [userId]);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch sales parameters
    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    const [salesResult] = await con.execute(salesQuery, [userId]);

    // Merge user details with sales parameters
    const userData = {
      ...userResult[0],
      ...salesResult[0],
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
