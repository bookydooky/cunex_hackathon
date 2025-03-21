import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: NextRequest) {
  try {
    const { userId, bannerId } = await req.json();

    if (!userId || !bannerId) {
      return NextResponse.json(
        { error: "Missing userId or bannerId" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
      user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
      password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
      database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
    });

    const [result] = (await connection.execute(
      `UPDATE colabs SET confirmed = FALSE WHERE userId = ? AND bannerId = ?`,
      [userId, bannerId]
    )) as any;

    await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Collaboration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Collaboration denied successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
