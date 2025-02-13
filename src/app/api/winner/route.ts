let winners = [];

export async function GET() {
  return Response.json({ winners: []});
}

export async function POST(req: Request) {
  const { name, amount } = await req.json();
  winners.push({ name, amount, date: new Date() });

  return Response.json({ success: true });
}
