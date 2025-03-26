import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise"; // Ensure mysql2 is installed

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_GATEWAY + "/notification";
  const clientID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  try {
    const body = await req.json();
    const { orderId } = body;
    // Create MySQL connection
    const con = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
      user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
      password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
      database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
    });

    // Query for all userIds with facultyCode 21
    const [rows] = (await con.execute(
      "SELECT userId FROM users WHERE studentId = '6538123621'"
    )) as any;

    await con.end(); // Close connection

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "No users found with studentId 6538123621" },
        { status: 404 }
      );
    }

    // Map all userIds into the notification payload
    const payload = {
      data: rows.map((row: any) => ({
        userId: row.userId,
        text_TH: "มีคำขอให้ผลิตส่งมาโดยลูกค้า แตะเพื่อดูรายละเอียด",
        text_EN:
          "There is a request for fabrication sent by a customer, tap to see detail.",
        callbackUrl: `https://cunexhackathon.vercel.app/service/fabrication/serviceProvider/${orderId}`,
      })),
    };

    // Send notification request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ClientID: clientID,
        ClientSecret: clientSecret,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log(rows.length, "users found with studentId 6538123621");
    return NextResponse.json({
      success: true,
      message: `Notification sent to ${rows.length} users successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
