

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get("ticker") || "AAPL"; // default ticker
    const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

    if (!FINNHUB_KEY) {
      return new Response(JSON.stringify({ error: "No API key set" }), { status: 500 });
    }

    const url = `https://finnhub.io/api/v1/stock/insider-transactions?symbol=${ticker}&token=${FINNHUB_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Finnhub API error" }), { status: res.status });
    }

    const data = await res.json();
    // Finnhub returns { data: [...] }
    return new Response(JSON.stringify(data.data || []));
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
