let jackpot = 1; // Inicializado en 1 WDL

export async function GET() {
  return Response.json({ jackpot });
}

export async function POST(req: Request) {
  const { amount, winner } = await req.json();
  
  if (winner) {
    jackpot = 0; // Reinicia el pozo si hay ganador
  } else {
    jackpot += amount; // Acumula si pierden
  }

  return Response.json({ jackpot });
}
