"use client";

import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

export default function TopTradesPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/stock/insider-transactions?symbol=AAPL&token=${API_KEY}`
        );
        const data = await res.json();

        setTrades(data.data?.slice(0, 10) || []);
      } catch (err) {
        console.error("Failed to fetch insider trades", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-400">Loading insider trades…</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Top Insider Trades</h1>
      <p className="text-gray-400 mb-6">
        Real insider transactions disclosed via SEC filings (Finnhub)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trades.map((trade, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={`https://logo.clearbit.com/${trade.symbol?.toLowerCase()}.com`}
                className="w-10 h-10 rounded"
                alt={trade.symbol}
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://via.placeholder.com/40")
                }
              />
              <div>
                <p className="font-semibold">
                  {trade.name || "Insider"}
                </p>
                <p className="text-sm text-gray-400">
                  {trade.symbol}
                </p>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-400">Action:</span>{" "}
                <span
                  className={`font-semibold ${
                    trade.transactionType === "P"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {trade.transactionType === "P" ? "BUY" : "SELL"}
                </span>
              </p>

              <p>
                <span className="text-gray-400">Shares:</span>{" "}
                {trade.share?.toLocaleString() || "—"}
              </p>

              <p>
                <span className="text-gray-400">Price:</span>{" "}
                ${trade.transactionPrice || "—"}
              </p>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Trade Date: {trade.transactionDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
