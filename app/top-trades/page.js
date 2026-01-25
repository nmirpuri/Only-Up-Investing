"use client";

import { useState, useEffect } from "react";

// Sample trades data for UI demonstration
const sampleTrades = [
  { name: "Tim Cook", symbol: "AAPL", shares: 1000, price: 175, date: "2026-01-15" },
  { name: "Elon Musk", symbol: "TSLA", shares: 500, price: 900, date: "2026-01-12" },
  { name: "Satya Nadella", symbol: "MSFT", shares: 750, price: 320, date: "2026-01-10" },
  { name: "Sundar Pichai", symbol: "GOOG", shares: 400, price: 140, date: "2026-01-08" },
  { name: "Katherine Adams", symbol: "AAPL", shares: 2000, price: 170, date: "2026-01-05" },
];

export default function TopTrades() {
  const [trades, setTrades] = useState([]);

  // Simulate fetching trades
  useEffect(() => {
    // In production, replace this with fetch("/api/insiders")
    setTrades(sampleTrades);
  }, []);

  const followedPeople = ["Tim Cook", "Elon Musk"];

  // Sort so followed people are at top
  const sortedTrades = trades.sort((a, b) => {
    if (followedPeople.includes(a.name)) return -1;
    if (followedPeople.includes(b.name)) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px", color: "#0f172a" }}>
        See What People Are Buying
      </h1>
      <p style={{ color: "#475569", marginBottom: "20px", fontSize: "1rem" }}>
        Insider trades for top executives and politicians. Followed people appear at the top.
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button style={buttonStyle}>CEOs</button>
        <button style={buttonStyle}>Politicians</button>
      </div>

      {sortedTrades.length === 0 ? (
        <p style={{ color: "#94a3b8", fontStyle: "italic" }}>No trades available at the moment.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {sortedTrades.map((trade, index) => (
            <div key={index} style={cardStyle}>
              <h2 style={{ margin: "0 0 5px 0", fontSize: "1.2rem", color: "#1e293b" }}>
                {trade.name}
              </h2>
              <p style={{ margin: "2px 0", color: "#475569" }}>
                <strong>Ticker:</strong> {trade.symbol}
              </p>
              <p style={{ margin: "2px 0", color: "#475569" }}>
                <strong>Shares:</strong> {trade.shares.toLocaleString()}
              </p>
              <p style={{ margin: "2px 0", color: "#475569" }}>
                <strong>Price:</strong> ${trade.price}
              </p>
              <p style={{ margin: "2px 0", color: "#475569" }}>
                <strong>Date:</strong> {trade.date}
              </p>
              <button style={followButtonStyle}>
                {followedPeople.includes(trade.name) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Fancy card style
const cardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.2s",
  cursor: "pointer",
};

const buttonStyle = {
  padding: "8px 16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.2s",
};

const followButtonStyle = {
  marginTop: "10px",
  padding: "6px 12px",
  background: "#0ea5e9",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: 500,
  cursor: "pointer",
};
