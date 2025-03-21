import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  const { searchParams } = new URL(request.url);
  const bannerId = searchParams.get("bannerId");

  if (!bannerId) {
    return NextResponse.json({ error: "Missing bannerId" }, { status: 400 });
  }

  try {
    const userDetailsQuery = `
      SELECT 
        u.userId,
        u.firstName,
        u.lastName,
        u.studentId,
        u.studentYear,
        u.facultyCode,
        f.facultyNameEN,
        c.confirmedOrg
      FROM colabs c
      JOIN users u ON c.userId = u.userId
      JOIN faculties f ON u.facultyCode = f.facultyCode
      WHERE c.bannerId = ? AND c.confirmed = True AND (c.confirmedOrg = True OR c.confirmedOrg IS NULL)
    `;

    const [users] = (await con.execute(userDetailsQuery, [bannerId])) as any;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No user found for the specified bannerId" },
        { status: 404 }
      );
    }

    const workTypesQuery = `
      SELECT DISTINCT 
        jb.typeOfWork
      FROM jobBanners jb
      WHERE jb.userId = ?
    `;

    const userPromises = users.map(async (user) => {
      const [workTypes] = await con.execute(workTypesQuery, [user.userId]);
      user.workTypes = workTypes.map((work) => work.typeOfWork);
      return user;
    });

    const usersWithWorkTypes = await Promise.all(userPromises);
    return NextResponse.json(usersWithWorkTypes);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
