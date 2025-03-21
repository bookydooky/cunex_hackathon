import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest, { params }: { params: { bannerId: string } }) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    const { bannerId } = params;

    // Query to fetch job details
    const jobQuery = `
      SELECT bannerId, userId, bannerName, price, duration, typeOfWork, bannerdesc 
      FROM jobBanners 
      WHERE bannerId = ?
    `;

    const [jobResult] = await con.execute(jobQuery, [bannerId]);

    if (jobResult.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Query to fetch image URLs
    const imageQuery = "SELECT imageURL FROM images WHERE bannerId = ?";
    const [imageResult] = await con.execute(imageQuery, [bannerId]);

    // Extract image URLs into an array
    const images = imageResult.map((row: any) => row.imageURL);

    // Return combined job details with images
    return NextResponse.json({
      ...jobResult[0], // Job details
      images, // Image URLs
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
