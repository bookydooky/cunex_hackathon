import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    // Query to fetch user details
    const userQuery = `
      SELECT u.firstName, u.lastName, u.facultyCode, u.studentYear, 
             f.facultyNameEN, u.studentId, u.phoneNumber, u.profileImageUrl
      FROM users u
      LEFT JOIN faculties f ON u.facultyCode = f.facultyCode
      WHERE u.userId = ?
    `;
    const [userResult]: any = await con.query(userQuery, [userId]);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Query to fetch sales parameters
    const salesQuery = `
      SELECT successRate, jobsSold, rehired, avgResponse, bio, rating 
      FROM salesParams 
      WHERE userId = ?
    `;
    const [salesResult]: any = await con.query(salesQuery, [userId]);

    // Merge user details with sales parameters
    const userData = {
      ...userResult[0],
      ...salesResult[0],
    };

    return NextResponse.json(userData); // Return user data as JSON response
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await con.end();
  }
}
