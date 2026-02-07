"use client";

import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

// Big-name companies insiders actually trade in
const SYMBOLS = ["AAPL", "MSFT", "NVDA", "AMZN", "META", "TSLA"];

export default function TopInsiderTrades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsiders = async () => {
      try {
        const results = await Promise.all(
          SYMBOLS.map(async (symbol) => {
            const res = await fetch(
              `https://finnhub.io/api/v1/stock/insider-transactions?symbol=${symbol}&token=${API_KEY}`
            );
            const data = await res.json();
            return data.data || [];
          })
        );

        const merged = results
          .flat()
          .filter((t) => t.transactionPrice && t.share)
          .sort(
            (a, b) =>
              new Date(b.transactionDate) -
              new Date(a.transactionDate)
          )
          .slice(0, 20);

        setTrades(merged);
      } catch (err) {
        console.error("Insider fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsiders();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-gray-400">
        Loading insider trades…
      </div>
    );
  }

  if (!trades.length) {
    return (
      <div className="p-8 text-gray-400">
        No recent insider trades reported.
        <br />
        (This happens — insiders don’t trade every day)
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        Top Insider Trades
      </h1>
      <p className="text-gray-400 mb-6">
        Real insider transactions disclosed via SEC filings (Finnhub)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {trades.map((t, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500 transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={`https://logo.clearbit.com/${t.symbol.toLowerCase()}.com`}
                className="w-10 h-10 rounded"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://via.placeholder.com/40")
                }
              />
              <div>
                <p className="font-semibold">{t.name || "Insider"}</p>
                <p className="text-sm text-gray-400">{t.symbol}</p>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-400">Action:</span>{" "}
                <span
                  className={`font-bold ${
                    t.transactionType === "P"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {t.transactionType === "P" ? "BUY" : "SELL"}
                </span>
              </p>

              <p>
                <span className="text-gray-400">Shares:</span>{" "}
                {t.share.toLocaleString()}
              </p>

              <p>
                <span className="text-gray-400">Price:</span>{" "}
                ${t.transactionPrice}
              </p>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              {t.transactionDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
