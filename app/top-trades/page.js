"use client";

import { useEffect, useState } from "react";
 
export default function TopTradesPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/top-trades")
      .then((res) => res.json())
      .then((data) => {
        setTrades(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
        See What People Are Buying
      </h1>
      <p style={{ marginBottom: "2rem", color: "#555" }}>
        Insider trades for top executives. Followed people appear at the top.
      </p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button style={buttonStyle}>CEOs</button>
        <button style={buttonStyle}>Politicians</button>
      </div>

      {loading ? (
        <p>Loading trades...</p>
      ) : trades.length === 0 ? (
        <p>No trades available at the moment.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {trades.map((trade, idx) => (
            <div key={idx} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 style={{ margin: 0 }}>{trade.name}</h2>
                {["Tim Cook", "Elon Musk"].includes(trade.name) && (
                  <span style={followedBadge}>Followed</span>
                )}
              </div>
              <p style={{ margin: "0.3rem 0", fontWeight: 600 }}>
                {trade.symbol} • {trade.transactionType}
              </p>
              <p style={{ margin: "0.3rem 0" }}>
                Shares: {trade.shares.toLocaleString()}
              </p>
              <p style={{ margin: "0.3rem 0" }}>
                Price: {trade.price ? `$${trade.price}` : "—"}
              </p>
              <p style={{ margin: "0.3rem 0", color: "#666" }}>
                {new Date(trade.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "999px",
  border: "none",
  background: "#2596be",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.3s",
};

const cardStyle = {
  background: "white",
  padding: "1rem",
  borderRadius: "1rem",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
};

const followedBadge = {
  background: "#ffcc00",
  padding: "0.2rem 0.5rem",
  borderRadius: "0.5rem",
  fontSize: "0.7rem",
  fontWeight: 700,
};
