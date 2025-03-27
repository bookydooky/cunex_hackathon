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
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing required field: orderId" },
        { status: 400 }
      );
    }

    // Update the completed status to TRUE where orderId matches
    const updateSql = `UPDATE orders SET completed = TRUE WHERE orderId = ?`;
    const [updateResult] = (await con.execute(updateSql, [orderId])) as any;

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Order not found or already completed" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order marked as completed successfully",
      orderId,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
