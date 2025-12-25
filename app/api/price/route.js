import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${apiKey}`
    );

    const json = await res.json();

    // json.c = current price
    // json.d = change
    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      price: json.c,
      change: Math.round((json.d / json.pc) * 100 * 100) / 100 || 0, // % change
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch price" }, { status: 500 });
  }
}
