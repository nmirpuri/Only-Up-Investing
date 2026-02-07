import { NextResponse } from "next/server";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// A curated list of highly traded US stocks (keeps API calls reasonable)
const SYMBOLS = [
  "AAPL", "MSFT", "NVDA", "AMZN", "META",
  "TSLA", "GOOGL", "AMD", "NFLX", "INTC",
  "COIN", "BA", "JPM", "BAC", "DIS"
];

export async function GET() {
  try {
    const results = await Promise.all(
      SYMBOLS.map(async symbol => {
        const quoteRes = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        const profileRes = await fetch(
          `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );

        const quote = await quoteRes.json();
        const profile = await profileRes.json();

        return {
          symbol,
          name: profile.name,
          price: quote.c,
          change: quote.dp,
          volume: quote.v,
          logo: profile.logo,        // ✅ REAL LOGO
          domain: profile.weburl,    // backup if needed
        };
      })
    );

    // Sort by volume (popular today)
    const sorted = results
      .filter(s => s.price)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 12);

    return NextResponse.json(sorted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch popular stocks" }, { status: 500 });
  }
}
