import { NextResponse } from "next/server";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Curated high-interest companies
const SYMBOLS = ["AAPL", "MSFT", "TSLA", "NVDA", "AMZN", "META", "GOOGL"];

export async function GET() {
  try {
    const trades = [];

    for (const symbol of SYMBOLS) {
      const res = await fetch(
        `https://finnhub.io/api/v1/stock/insider-transactions?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );

      const data = await res.json();

      if (!data?.data) continue;

      data.data.forEach((t) => {
        trades.push({
          name: t.name,
          symbol,
          type: t.transactionType === "P" ? "BUY" : "SELL",
          shares: t.share,
          price: t.transactionPrice,
          date: t.transactionDate,
        });
      });
    }

    return NextResponse.json(
      trades
        .filter(t => t.shares && t.price)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 30)
    );
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch insider trades" }, { status: 500 });
  }
}
