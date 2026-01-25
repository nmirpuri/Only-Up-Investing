import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

// People you want pinned at the top
const FOLLOWED_PEOPLE = ["Tim Cook", "Elon Musk", "Pelosi", "Warren Buffett"];

export async function GET() {
  try {
    // Fetch CEO insider trades (example with AAPL)
    const ceoRes = await fetch(
      `https://finnhub.io/api/v1/stock/insider-transactions?symbol=AAPL&token=${FINNHUB_KEY}`
    );
    const ceoData = await ceoRes.json();

    // Placeholder for politician trades
    const politicianData = []; // can add OpenFEC API later

    function processTrades(trades) {
      return trades
        .filter((t) => t.name) // remove null names
        .sort((a, b) =>
          FOLLOWED_PEOPLE.includes(a.name) ? -1 : FOLLOWED_PEOPLE.includes(b.name) ? 1 : 0
        );
    }

    return NextResponse.json({
      ceos: processTrades(ceoData),
      politicians: politicianData,
    });
  } catch (err) {
    console.error("Error fetching trades:", err);
    return NextResponse.json({ ceos: [], politicians: [] });
  }
}
