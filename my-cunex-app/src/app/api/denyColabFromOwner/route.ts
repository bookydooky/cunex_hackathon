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
    const { userId, bannerId } = await request.json();

    if (!userId || !bannerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const denyQuery = `
      UPDATE colabs
      SET confirmedOrg = FALSE
      WHERE userId = ? AND bannerId = ?
    `;

    const [result] = await con.execute(denyQuery, [userId, bannerId]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Collaboration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Collaboration denied successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
