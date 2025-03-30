import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  // Get the userId from URL search params
  const { searchParams } = new URL(request.url);
  const historyId = searchParams.get("historyId");

  if (!historyId) {
    return NextResponse.json({ error: "Missing historyId" }, { status: 400 });
  }

  try {
    // Query to fetch image URLs
    const imageQuery =
      "SELECT imageURL FROM submittedImages WHERE historyId = ?";
    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    const [imageResult] = await con.execute(imageQuery, [historyId]);

    // Extract image URLs into an array
    const images = imageResult.map((row: any) => row.imageURL);

    // Return combined job details with images
    return NextResponse.json({
      images, // Image URLs
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
