import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  // TEMP: mock data
  const mockPrices = {
    AAPL: 189.23,
    TSLA: 810.5,
    GOOGL: 135.1
  };

  const price = mockPrices[symbol.toUpperCase()] || 100;

  return NextResponse.json({
    symbol: symbol.toUpperCase(),
    price,
    change: Math.round((Math.random() - 0.5) * 10 * 100) / 100 // random % change
  });
}
