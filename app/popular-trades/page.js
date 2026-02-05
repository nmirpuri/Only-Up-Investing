"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PopularTrades() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch("/api/popular-stocks")
      .then(res => res.json())
      .then(data => setStocks(data));
  }, []);

  return (
    <div style={{ padding: 40, background: "#0b0f19", minHeight: "100vh" }}>
      <h1 style={{ color: "white", fontSize: 36, marginBottom: 8 }}>
        🔥 Popular Trades
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: 32 }}>
        Most viewed and traded stocks right now
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {stocks.map(stock => (
          <Link
            key={stock.symbol}
            href={`/stock/${stock.symbol}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "linear-gradient(145deg, #111827, #020617)",
                borderRadius: 16,
                padding: 20,
                color: "white",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={`https://logo.clearbit.com/${stock.domain}`}
                  alt={stock.name}
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{stock.name}</h3>
                  <span style={{ color: "#9ca3af" }}>{stock.symbol}</span>
                </div>
              </div>

              {/* Price */}
              <div style={{ marginTop: 20 }}>
                <h2 style={{ margin: 0 }}>${stock.price}</h2>
                <span
                  style={{
                    color: stock.change > 0 ? "#22c55e" : "#ef4444",
                    fontWeight: 600,
                  }}
                >
                  {stock.change > 0 ? "+" : ""}
                  {stock.change}%
                </span>
              </div>

              {/* Footer */}
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "#9ca3af",
                }}
              >
                <span>👀 {stock.views.toLocaleString()}</span>
                <span>⭐ Watch</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
