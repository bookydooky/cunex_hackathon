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
    const { userId, workTitle, workType, price, duration, description } = body;

    if (!workTitle || !workType || !price || !duration || !description) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // Step 1: Fetch the latest bannerId
    const getLatestIdQuery = `
      SELECT bannerId FROM jobBanners ORDER BY bannerId DESC LIMIT 1
    `;
    const [rows]: any = await con.execute(getLatestIdQuery);

    let newId;
    if (rows.length > 0) {
      const lastId = rows[0].bannerId.replace(/^0+/, ""); // Remove leading zeros
      const nextId = parseInt(lastId, 10) + 1; // Increment by 1
      newId = nextId.toString().padStart(20, "0"); // Ensure 20-character format
    } else {
      newId = "00000000000000000001"; // Start from 1 with zero padding
    }

    // Step 2: Insert new row with auto-incremented bannerId
    const insertQuery = `
      INSERT INTO jobBanners (bannerId, userId, bannerName, price, duration, typeOfWork, bannerDesc, tools)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [newId, userId, workTitle, price, duration, workType, description, "AAA"];

    await con.execute(insertQuery, values);

    return NextResponse.json({
      message: "Portfolio added successfully",
      bannerId: newId,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
