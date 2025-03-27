import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise"; // Ensure mysql2 is installed

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_GATEWAY + "/notification";
  const clientID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  try {
    const { sellerId, buyerId, orderId } = await req.json();

    const con = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
      user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
      password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
      database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
    });
    const payload = {
      data: [
        {
          userId: buyerId,
          text_TH: "คำขอของคุณได้รับแล้วโดยผู้ให้บริการ แตะเพื่อดูรายละเอียด",
          text_EN:
            "Your request have been recieved by a service provider, tap to see detail.",
          callbackUrl: `http://cunexhackathon.vercel.app/service/fabrication/appearContactInfo/${sellerId}`,
        },
      ],
    };
    const notificationResponse = await fetch(url, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        ClientID: clientID || "",
        ClientSecret: clientSecret || "",
      }),
      body: JSON.stringify(payload),
    });

    const notificationResult = await notificationResponse.json();
    const mysqlDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const [updateResult] = (await con.execute(
      "UPDATE orders SET sellerId = ?, receivedDate = ? WHERE orderId = ?",
      [sellerId, mysqlDateTime, orderId]
    )) as any;
    return NextResponse.json({
      success: true,
      message: "Notification sent and order updated successfully",
      notificationData: notificationResult,
      updateResult: updateResult,
    });
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error processing request",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
