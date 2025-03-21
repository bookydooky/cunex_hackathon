import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });
  
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const typeOfWorkParam = searchParams.get("typeOfWork");
    
    // Base query
    let query = `
      SELECT jb.bannerId, jb.bannerName, jb.price, jb.typeOfWork, 
             MIN(img.imageId) as firstImageId, 
             (SELECT imageURL FROM images WHERE bannerId = jb.bannerId ORDER BY imageId ASC LIMIT 1) as imageURL
      FROM jobBanners jb
      LEFT JOIN images img ON jb.bannerId = img.bannerId
    `;
    
    const queryParams: any[] = [];
    
    // Add filter for typeOfWork if provided
    if (typeOfWorkParam && typeOfWorkParam.toLowerCase() !== "none") {
      query += ` WHERE jb.typeOfWork = ? `;
      queryParams.push(typeOfWorkParam);
    }
    
    query += ` GROUP BY jb.bannerId ORDER BY jb.bannerId DESC`;
    
    // Add LIMIT clause only if a numeric limit is provided
    if (limitParam && limitParam.toLowerCase() !== "none" && !isNaN(parseInt(limitParam))) {
      // Convert the limit to a number first
      const limit = parseInt(limitParam);
      query += ` LIMIT ${limit}`;  // Use the actual value directly in the query
    }
    
    // Execute query - note we only pass queryParams if we have WHERE conditions
    const [results]: any = typeOfWorkParam && typeOfWorkParam.toLowerCase() !== "none" 
      ? await con.execute(query, queryParams)
      : await con.execute(query);
      
    await con.end(); // Important: close the connection
    
    return NextResponse.json({ jobs: results });
  } catch (error) {
    console.error("Database error:", error);
    try {
      await con.end();
    } catch (e) {
      // Ignore errors from closing the connection
    }
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}