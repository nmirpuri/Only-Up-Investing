import React from "react";

async function getInsiderTrades() {
  const res = await fetch("/api/insiders", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch insider trades");
  }
  return res.json();
}

export default async function TopTradesPage() {
  const trades = await getInsiderTrades();

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
        Top Trades
      </h1>

      <div style={{ display: "grid", gap: 16 }}>
        {trades.slice(0, 20).map((trade, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontWeight: 600 }}>{trade.reportingName}</p>
              <p style={{ color: "#6b7280" }}>
                {trade.symbol} • {trade.transactionType}
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <p style={{ color: trade.transactionType === "Buy" ? "green" : "red" }}>
                {trade.transactionType}
              </p>
              <p style={{ color: "#6b7280", fontSize: 12 }}>
                {new Date(trade.transactionDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
