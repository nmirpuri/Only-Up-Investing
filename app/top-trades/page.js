"use client";

import { useEffect, useState } from "react";

// Mock CEO trade data (replace with real API later)
const sampleTrades = [
  {
    name: "Tim Cook",
    symbol: "AAPL",
    sector: "Information Technology",
    type: "BUY",
    shares: 1000,
    price: 175,
    date: "2026-01-15",
  },
  {
    name: "Elon Musk",
    symbol: "TSLA",
    sector: "Consumer Discretionary",
    type: "SELL",
    shares: 500,
    price: 900,
    date: "2026-01-12",
  },
  {
    name: "Satya Nadella",
    symbol: "MSFT",
    sector: "Information Technology",
    type: "BUY",
    shares: 750,
    price: 320,
    date: "2026-01-10",
  },
  {
    name: "Sundar Pichai",
    symbol: "GOOG",
    sector: "Communication Services",
    type: "BUY",
    shares: 400,
    price: 140,
    date: "2026-01-08",
  },
  {
    name: "Katherine Adams",
    symbol: "AAPL",
    sector: "Information Technology",
    type: "SELL",
    shares: 2000,
    price: 170,
    date: "2026-01-05",
  },
];

export default function Page() {
  const [trades, setTrades] = useState([]);
  const [tradeType, setTradeType] = useState("ALL");

  useEffect(() => {
    // Later: fetch("/api/ceo-trades")
    setTrades(sampleTrades);
  }, []);

  const filteredTrades = trades
    .filter((t) => tradeType === "ALL" || t.type === tradeType)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>CEO Insider Trades</h1>
      <p style={subtitleStyle}>
        Track recent insider trades from top executives.
      </p>

      {/* Trade type filter */}
      <div style={filterRow}>
        <button
          onClick={() => setTradeType("ALL")}
          style={tradeType === "ALL" ? activeFilter : filterButton}
        >
          All
        </button>
        <button
          onClick={() => setTradeType("BUY")}
          style={tradeType === "BUY" ? activeBuy : filterButton}
        >
          Buys
        </button>
        <button
          onClick={() => setTradeType("SELL")}
          style={tradeType === "SELL" ? activeSell : filterButton}
        >
          Sells
        </button>
      </div>

      {/* Trades Table */}
      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead>
            <tr style={headerRow}>
              <th>Name</th>
              <th>Ticker</th>
              <th>Sector</th>
              <th>Type</th>
              <th>Shares</th>
              <th>Price</th>
              <th>Date</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((trade, i) => (
              <tr key={i} style={rowStyle}>
                <td>{trade.name}</td>
                <td style={{ fontWeight: 600 }}>{trade.symbol}</td>
                <td>{trade.sector}</td>
                <td
                  style={{
                    color: trade.type === "BUY" ? "#16a34a" : "#dc2626",
                    fontWeight: 600,
                  }}
                >
                  {trade.type}
                </td>
                <td>{trade.shares.toLocaleString()}</td>
                <td>${trade.price}</td>
                <td>{trade.date}</td>
                <td style={{ fontWeight: 600 }}>
                  ${(trade.shares * trade.price).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTrades.length === 0 && (
          <p style={emptyState}>No trades found.</p>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = {
  padding: "40px",
  maxWidth: "1200px",
  margin: "0 auto",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};

const titleStyle = {
  fontSize: "2.2rem",
  fontWeight: 700,
  color: "#0f172a",
};

const subtitleStyle = {
  marginTop: "6px",
  marginBottom: "24px",
  color: "#475569",
};

const filterRow = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const filterButton = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  background: "white",
  cursor: "pointer",
  fontWeight: 500,
};

const activeFilter = {
  ...filterButton,
  background: "#0f172a",
  color: "white",
};

const activeBuy = {
  ...filterButton,
  background: "#16a34a",
  color: "white",
};

const activeSell = {
  ...filterButton,
  background: "#dc2626",
  color: "white",
};

const tableWrapper = {
  overflowX: "auto",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const headerRow = {
  background: "#f8fafc",
  textAlign: "left",
  color: "#475569",
};

const rowStyle = {
  borderTop: "1px solid #e2e8f0",
};

const emptyState = {
  padding: "20px",
  color: "#94a3b8",
  textAlign: "center",
};
