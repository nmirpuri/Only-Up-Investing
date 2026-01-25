"use client";

import { useEffect, useState } from "react";

// Followed people
const followedPeople = ["Tim Cook", "Elon Musk", "Sundar Pichai"];

// Fallback roles and shares for known followed people
const fallbackData = {
  "Tim Cook": { relationship: "CEO", shares_traded: 1000 },
  "Elon Musk": { relationship: "CEO", shares_traded: 5000 },
  "Sundar Pichai": { relationship: "CEO", shares_traded: 2000 },
};

// Tickers to fetch insider trades from
const tickers = ["AAPL", "TSLA", "MSFT", "AMZN", "GOOGL"];

export default function TopTrades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrades() {
      setLoading(true);
      try {
        let allTrades = [];

        // Fetch trades for each ticker
        for (let ticker of tickers) {
          const res = await fetch(`/api/insiders?ticker=${ticker}`);
          const data = await res.json();

          if (Array.isArray(data)) {
            const tradesWithTicker = data.map((t) => ({
              name: t.name,
              relationship: t.relationship || (fallbackData[t.name]?.relationship ?? "—"),
              ticker,
              transaction_type: t.transactionType || "—",
              shares_traded: t.shares ?? fallbackData[t.name]?.shares_traded ?? "—",
              price: t.price ?? "—",
              transaction_date: t.transactionDate || "—",
            }));
            allTrades = allTrades.concat(tradesWithTicker);
          }
        }

        // Filter out trades with no name
        let filtered = allTrades.filter((t) => t.name);

        // Deduplicate trades (same name, ticker, type, date)
        filtered = filtered.filter(
          (trade, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.name === trade.name &&
                t.ticker === trade.ticker &&
                t.transaction_type === trade.transaction_type &&
                t.transaction_date === trade.transaction_date
            )
        );

        // Sort by date descending
        filtered.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

        // Move followed people to the top
        filtered.sort((a, b) => {
          const aFollowed = followedPeople.includes(a.name) ? 0 : 1;
          const bFollowed = followedPeople.includes(b.name) ? 0 : 1;
          return aFollowed - bFollowed;
        });

        setTrades(filtered);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    fetchTrades();
  }, []);

  if (loading) return <p style={{ padding: 24 }}>Loading trades...</p>;
  if (!trades.length) return <p style={{ padding: 24 }}>No trades available at the moment.</p>;

  return (
    <div style={{ padding: "24px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "16px", color: "#1e3a8a" }}>See What People are Buying</h1>

      <p style={{ marginBottom: "24px", color: "#374151" }}>
        Showing insider trades for top executives. Followed people appear at the top.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <thead style={{ backgroundColor: "#1e40af", color: "white" }}>
            <tr>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Role</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Ticker</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "12px 8px", textAlign: "right" }}>Shares</th>
              <th style={{ padding: "12px 8px", textAlign: "right" }}>Price</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => {
              const isFollowed = followedPeople.includes(t.name);
              return (
                <tr
                  key={i}
                  style={{
                    backgroundColor: isFollowed ? "#fef3c7" : i % 2 === 0 ? "#f9fafb" : "#ffffff"
                  }}
                >
                  <td style={{ padding: "10px 8px", fontWeight: isFollowed ? 600 : 400 }}>{t.name}</td>
                  <td style={{ padding: "10px 8px" }}>{t.relationship}</td>
                  <td style={{ padding: "10px 8px" }}>{t.ticker}</td>
                  <td style={{ padding: "10px 8px" }}>{t.transaction_type}</td>
                  <td style={{ padding: "10px 8px", textAlign: "right" }}>{t.shares_traded}</td>
                  <td style={{ padding: "10px 8px", textAlign: "right" }}>{t.price !== "—" ? `$${t.price.toFixed(2)}` : "—"}</td>
                  <td style={{ padding: "10px 8px" }}>{t.transaction_date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
