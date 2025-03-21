import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
interface Banner {
  bannerId: string;
  bannerName: string;
  price: number;
  duration: string;
  typeOfWork: string;
}
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
      user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
      password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
      database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
    });

    const [banners] = (await connection.execute(
      `SELECT 
        jb.bannerId,
        jb.bannerName,
        jb.price,
        jb.duration,
        jb.typeOfWork
      FROM jobBanners jb
      WHERE jb.userId = ? AND jb.bannerId IN (SELECT bannerId FROM colabs)`,
      [userId]
    )) as any;

    await connection.end();

    const formattedBanners = banners.map((banner: Banner) => ({
      bannerId: banner.bannerId,
      bannerName: banner.bannerName,
      price: banner.price,
      duration: banner.duration,
      typeOfWork: banner.typeOfWork,
    }));

    return NextResponse.json(formattedBanners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
