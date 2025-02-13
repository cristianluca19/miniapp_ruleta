import { NextResponse } from "next/server";

// export async function POST() {
//   // Simula una transacción de 0.1 WLD
//   return NextResponse.json({ success: true, amount: 0.1, currency: "WLD" });
// }
export async function POST(req: Request) {
  const { amount, number } = await req.json();
  const success = Math.random() > 0.2; // Simulación de pago exitoso

  if (success) {
    await fetch("/api/jackpot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 0.1, winner: false }),
    });
  }

  return Response.json({ success });
}

