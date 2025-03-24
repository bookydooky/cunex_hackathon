import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bannerId: string }> }
) {
  const { bannerId } = await params;
  console.log(bannerId);
  if (!bannerId) {
    return NextResponse.json({ error: "Missing bannerId" }, { status: 400 });
  }

  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    const sql = `
      SELECT 
        f.rating, 
        f.detail, 
        u.firstName, 
        u.lastName, 
        fac.facultyNameEN, 
        u.studentYear
      FROM feedbacks f
      JOIN users u ON f.userId = u.userId
      JOIN faculties fac ON u.facultyCode = fac.facultyCode
      WHERE f.bannerId = ?
    `;

    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    const [rows] = await con.query(sql, [bannerId]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await con.end();
  }
}
