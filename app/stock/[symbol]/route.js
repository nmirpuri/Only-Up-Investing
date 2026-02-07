import { NextResponse } from "next/server";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

export async function GET(req, { params }) {
  const { symbol } = params;

  try {
    const quoteRes = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    const profileRes = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );

    const quote = await quoteRes.json();
    const profile = await profileRes.json();

    return NextResponse.json({
      symbol,
      name: profile.name,
      logo: profile.logo,
      price: quote.c,
      change: quote.dp,
      high: quote.h,
      low: quote.l,
      volume: quote.v,
      marketCap: profile.marketCapitalization * 1_000_000,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
  }
}
