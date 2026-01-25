"use client";

import { useEffect, useState } from "react";

const FOLLOWED_PEOPLE = ["Tim Cook", "Elon Musk", "Pelosi", "Warren Buffett"];

export default function TopTradesPage() {
  const [ceoTrades, setCeoTrades] = useState([]);
  const [politicianTrades, setPoliticianTrades] = useState([]);
  const [activeTab, setActiveTab] = useState("CEOs");
  const [loading, setLoading] = useState(true);

  async function fetchTrades() {
    setLoading(true);
    try {
      const res = await fetch("/api/top-trades");
      const data = await res.json();
      setCeoTrades(data.ceos || []);
      setPoliticianTrades(data.politicians || []);
    } catch (err) {
      console.error("Error fetching trades:", err);
      setCeoTrades([]);
      setPoliticianTrades([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTrades();
    const interval = setInterval(fetchTrades, 60 * 1000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const tradesToShow = activeTab === "CEOs" ? ceoTrades : politicianTrades;

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>See What People Are Buying</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        Insider trades for top executives and politicians. Followed people appear at the top.
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab("CEOs")}
          style={{
            padding: "8px 16px",
            background: activeTab === "CEOs" ? "#2596be" : "#e5e7eb",
            color: activeTab === "CEOs" ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          CEOs
        </button>
        <button
          onClick={() => setActiveTab("Politicians")}
          style={{
            padding: "8px 16px",
            background: activeTab === "Politicians" ? "#2596be" : "#e5e7eb",
            color: activeTab === "Politicians" ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Politicians
        </button>
      </div>

      {loading ? (
        <p>Loading trades...</p>
      ) : tradesToShow.length === 0 ? (
        <p>No trades available at the moment.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            background: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <thead style={{ background: "#f3f4f6" }}>
            <tr>
              <th style={{ padding: "12px" }}>Name</th>
              <th>Role</th>
              <th>Ticker</th>
              <th>Type</th>
              <th>Shares</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tradesToShow.map((trade, i) => (
              <tr
                key={i}
                style={{
                  background: FOLLOWED_PEOPLE.includes(trade.name) ? "#fffbe6" : "#fff",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <td style={{ padding: "8px" }}>{trade.name}</td>
                <td>{trade.role || "—"}</td>
                <td>{trade.symbol || "—"}</td>
                <td>{trade.transactionType || "—"}</td>
                <td>{trade.shares || "—"}</td>
                <td>{trade.price || "—"}</td>
                <td>{trade.date || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
