import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Create a MySQL connection pool (configure with your credentials)
const con = await mysql.createConnection({
  host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
  user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
  password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
  database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    // Query the orders table using the provided orderId
    const [rows] = (await con.execute(
      "SELECT buyerId,requestDate,serviceType, fileUrl, material, specs, additional, filename FROM orders WHERE orderId = ?",
      [id]
    )) as any;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return the order details
    return NextResponse.json({ order: rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
