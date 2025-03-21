import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  const historyId = request.nextUrl.pathname.split("/").pop() || "";

  if (!historyId) {
    return NextResponse.json({ error: "Missing historyId" }, { status: 400 });
  }

  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    // Query to fetch job status details including the accept field
    const statusQuery = `
      SELECT jh.accept, jh.historyId
      FROM jobHistory jh
      WHERE jh.historyId = ?
    `;
    const [rows]:any = await con.query(statusQuery, [historyId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Job history not found" }, { status: 404 });
    }

    // Return job status details
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching job status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await con.end();
  }
}
