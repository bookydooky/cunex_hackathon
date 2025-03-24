import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bannerId: string }> }
) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    const { bannerId } = await params;

    // Query to fetch job details
    const jobQuery = `
    SELECT 
        jb.bannerId, 
        jb.userId, 
        jb.bannerName, 
        jb.price, 
        jb.duration, 
        jb.typeOfWork, 
        jb.bannerdesc,
        u.bank,
        u.accountNumber,
        u.phoneNumber
    FROM 
        jobBanners jb
    JOIN 
        users u ON jb.userId = u.userId
    WHERE 
        jb.bannerId = ?
    `;

    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    const [jobResult] = await con.execute(jobQuery, [bannerId]);

    if (jobResult.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Query to fetch image URLs
    const imageQuery = "SELECT imageURL FROM images WHERE bannerId = ?";
    //@ts-expect-error - TS doesn't know about the mysql2/promise API
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
