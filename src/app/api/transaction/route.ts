import { NextResponse } from "next/server";

export async function POST() {
  // Simula una transacción de 0.1 WLD
  return NextResponse.json({ success: true, amount: 0.1, currency: "WLD" });
}

