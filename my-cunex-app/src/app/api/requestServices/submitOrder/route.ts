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
    const {
      userId,
      serviceType,
      fileUrl,
      filename,
      material,
      specs,
      additional,
    } = body;

    if (!userId || !serviceType || !fileUrl || !material) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const mysqlDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const values = [
      [
        userId,
        mysqlDateTime,
        serviceType,
        fileUrl,
        filename,
        material,
        specs,
        additional,
      ],
    ];

    // Insert images into the submittedImages table
    const insertSql =
      "INSERT INTO orders (buyerId, requestDate, serviceType, fileUrl, filename ,material, specs, additional) VALUES ?";

    const [insertResult] = (await con.query(insertSql, [values])) as any;

    return NextResponse.json({
      success: true,
      message: "Images saved and progress updated successfully",
      insertedCount: insertResult.affectedRows,
      orderId: insertResult.insertId,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
