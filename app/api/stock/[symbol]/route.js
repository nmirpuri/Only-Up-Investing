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
  name: profile.name || symbol,
  logo: profile.logo || null,
  price: quote.c ?? 0,
  change: quote.dp ?? 0,
  high: quote.h ?? 0,
  low: quote.l ?? 0,
  volume: quote.v ?? 0,
  marketCap: profile.marketCapitalization
    ? profile.marketCapitalization * 1_000_000
    : null,
});

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
  }
}
