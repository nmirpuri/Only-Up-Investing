"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PopularTrades() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/popular-stocks")
      .then(res => res.json())
      .then(data => {
        setStocks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 40, background: "#0b0f19", minHeight: "100vh" }}>
      <h1 style={{ color: "white", fontSize: 36, marginBottom: 8 }}>
        🔥 Popular Trades
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: 32 }}>
        Most actively traded stocks right now
      </p>

      {/* Loading State */}
      {loading && (
        <p style={{ color: "#9ca3af" }}>Loading live market data...</p>
      )}

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
                  src={stock.logo || "/logo-placeholder.png"}
                  alt={stock.name}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    objectFit: "contain",
                    background: "#020617",
                  }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{stock.name}</h3>
                  <span style={{ color: "#9ca3af" }}>{stock.symbol}</span>
                </div>
              </div>

              {/* Price */}
              <div style={{ marginTop: 20 }}>
                <h2 style={{ margin: 0 }}>
                  ${stock.price?.toFixed(2)}
                </h2>
                <span
                  style={{
                    color: stock.change > 0 ? "#22c55e" : "#ef4444",
                    fontWeight: 600,
                  }}
                >
                  {stock.change > 0 ? "+" : ""}
                  {stock.change?.toFixed(2)}%
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
                <span>📊 Vol {stock.volume?.toLocaleString()}</span>
                <span>⭐ View</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
