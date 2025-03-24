import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: NextRequest) {
  const { clickedBannerId, userId, feedback, rating } = await request.json();
  console.log(clickedBannerId);
  if (!clickedBannerId || !rating) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    const sql =
      "INSERT INTO feedbacks (bannerId, userId, rating, detail) VALUES (?, ?, ?, ?)";
    const values = [clickedBannerId, userId, rating, feedback || null];

    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    const [result] = await con.query(sql, values);

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      insertedId: result.insertId,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await con.end();
  }
}
