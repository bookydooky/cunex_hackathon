import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_GATEWAY + "/notification";
  const clientID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  try {
    const { userId } = await req.json();
    const payload = {
      data: [
        {
          userId: userId,
          text_TH: "คำขอของคุณได้รับแล้วโดยผู้ให้บริการ แตะเพื่อดูรายละเอียด",
          text_EN:
            "Your request have been recieved by a service provider, tap to see detail.",
          callbackUrl:
            "http://cunexhackathon.vercel.app/service/fabrication/appearContactInfo",
        },
      ],
    };
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
    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
