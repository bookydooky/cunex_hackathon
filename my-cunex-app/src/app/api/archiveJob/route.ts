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
    const { historyId } = body;

    if (!historyId) {
      return NextResponse.json(
        { error: "Missing required field: historyId" },
        { status: 400 }
      );
    }

    // Update the completed status to TRUE where orderId matches
    const updateSql = `UPDATE jobHistory SET archived = TRUE WHERE historyId = ?`;
    const [updateResult] = (await con.execute(updateSql, [historyId])) as any;

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Job not found or already archived" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Job archived successfully",
      historyId,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
