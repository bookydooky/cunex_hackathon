import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
interface Collaboration {
  bannerId: string;
  bannerName: string;
  price: number;
  duration: string;
  sellerFirstName: string;
  sellerLastName: string;
  sellerId: string;
  confirmedOrg: boolean | null;
  confirmed: boolean | null;
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const query = `
    SELECT 
      jb.bannerId,
      jb.bannerName, 
      jb.price,
      jb.duration, 
      su.firstName AS sellerFirstName, 
      su.lastName AS sellerLastName,
      su.userId AS sellerId,
      c.confirmedOrg,
      c.confirmed
    FROM colabs c
    JOIN jobBanners jb ON c.bannerId = jb.bannerId
    JOIN users su ON jb.userId = su.userId
    WHERE c.userId = ? AND (c.confirmed IS NULL OR c.confirmedOrg = True OR (c.confirmed = True AND c.confirmedOrg IS NULL))
  `;

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
      user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
      password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
      database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
    });
    const [collaborations] = await connection.execute(query, [userId]);

    const formattedCollaborations = collaborations.map(
      (collab: Collaboration) => ({
        bannerId: collab.bannerId,
        bannerName: collab.bannerName,
        price: collab.price,
        duration: collab.duration,
        firstName: collab.sellerFirstName,
        lastName: collab.sellerLastName,
        Id: collab.sellerId,
        confirmed: collab.confirmed,
        confirmedOrg: collab.confirmedOrg,
      })
    );

    return NextResponse.json(formattedCollaborations);
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
