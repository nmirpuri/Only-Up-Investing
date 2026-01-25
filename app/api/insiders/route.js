const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

export async function GET() {
  try {
    const tickers = ["AAPL", "TSLA", "MSFT", "AMZN"];
    let allTrades = [];

    for (let symbol of tickers) {
      const res = await fetch(
        `https://finnhub.io/api/v1/stock/insider-transactions?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      const data = await res.json();
      if (data.data) {
        allTrades = allTrades.concat(
          data.data.map((trade) => ({
            name: trade.name,
            symbol: trade.symbol,
            shares: trade.share,
            transactionType:
              trade.transactionCode === "S"
                ? "Sale"
                : trade.transactionCode === "G"
                ? "Gift"
                : trade.transactionCode === "P"
                ? "Purchase"
                : trade.transactionCode,
            price: trade.transactionPrice,
            date: trade.transactionDate,
          }))
        );
      }
    }

    // Filter out trades without names
    allTrades = allTrades.filter((trade) => trade.name);

    // Followed people at the top
    const followedPeople = ["Tim Cook", "Elon Musk"];
    allTrades.sort((a, b) => {
      if (followedPeople.includes(a.name)) return -1;
      if (followedPeople.includes(b.name)) return 1;
      return new Date(b.date) - new Date(a.date);
    });

    // Top 30 trades
    allTrades = allTrades.slice(0, 30);

    return new Response(JSON.stringify(allTrades), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch insider trades" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
