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
      `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${apiKey}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    // Finnhub returns 0s when it fails
    if (!data.c || data.c === 0) {
      return NextResponse.json(
        { error: "Invalid symbol or API limit reached" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      price: Number(data.c.toFixed(2)),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch stock price" },
      { status: 500 }
    );
  }
}
