"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StockPage() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/stock/${symbol}`)
      .then(res => res.json())
      .then(data => {
        setStock(data);
        setLoading(false);
      });
  }, [symbol]);

  if (loading) {
    return (
      <div style={{ padding: 40, color: "white", background: "#0b0f19" }}>
        Loading {symbol}...
      </div>
    );
  }

  if (!stock) {
    return (
      <div style={{ padding: 40, color: "white", background: "#0b0f19" }}>
        Stock not found
      </div>
    );
  }

  return (
    <div style={{ padding: 40, background: "#0b0f19", minHeight: "100vh", color: "white" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src={stock.logo}
          alt={stock.name}
          style={{ width: 56, height: 56, borderRadius: 12 }}
        />
        <div>
          <h1 style={{ margin: 0 }}>{stock.name}</h1>
          <span style={{ color: "#9ca3af" }}>{stock.symbol}</span>
        </div>
      </div>

      {/* Price */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 42 }}>
          ${stock.price.toFixed(2)}
        </h2>
        <span
          style={{
            color: stock.change > 0 ? "#22c55e" : "#ef4444",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {stock.change > 0 ? "+" : ""}
          {stock.change.toFixed(2)}%
        </span>
      </div>

      {/* Stats */}
      <div
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
       <Statlabel="Market Cap" value={stock.marketCap? `$${(stock.marketCap / 1e9).toFixed(2)}B`: "N/A"}/>
        <Stat label="Day High" value={`$${stock.high}`} />
        <Stat label="Day Low" value={`$${stock.low}`} />
       <Stat label="Volume" value={stock.volume && stock.volume > 0? stock.volume.toLocaleString(): "N/A"}/>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        background: "#020617",
        padding: 20,
        borderRadius: 14,
      }}
    >
      <span style={{ color: "#9ca3af", fontSize: 14 }}>{label}</span>
      <h3 style={{ marginTop: 8 }}>{value}</h3>
    </div>
  );
}
