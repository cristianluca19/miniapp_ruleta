import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://developer.worldcoin.org/api/v2/verify/app_8552501b4d2cd6b80c8045bfb0886096",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
          action: "verify-user",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    const { verified } = await response.json();
    return NextResponse.json({ success: verified }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
