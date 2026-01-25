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
    const interval = setInterval(fetchTrades, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const tradesToShow = activeTab === "CEOs" ? ceoTrades : politicianTrades;

  const typeColors = {
    Buy: "#4ade80", // green
    Sale: "#f87171", // red
    Gift: "#fbbf24", // yellow
    Tax: "#a78bfa", // purple
    Derivative: "#60a5fa", // blue
  };

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "8px", color: "#1e293b" }}>
        See What People Are Buying
      </h1>
      <p style={{ color: "#475569", marginBottom: "24px", fontSize: "1rem" }}>
        Insider trades for top executives and politicians. Followed people appear at the top.
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        {["CEOs", "Politicians"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              borderRadius: "999px",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              background: activeTab === tab ? "linear-gradient(90deg, #3b82f6, #06b6d4)" : "#e5e7eb",
              color: activeTab === tab ? "#fff" : "#1e293b",
              boxShadow: activeTab === tab ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
              transition: "all 0.3s ease",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#475569" }}>Loading trades...</p>
      ) : tradesToShow.length === 0 ? (
        <p style={{ color: "#475569" }}>No trades available at the moment.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {tradesToShow.map((trade, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                borderRadius: "16px",
                background: "#fff",
                boxShadow: FOLLOWED_PEOPLE.includes(trade.name)
                  ? "0 8px 20px rgba(59, 130, 246, 0.2)"
                  : "0 4px 12px rgba(0,0,0,0.05)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{trade.name}</h2>
                {FOLLOWED_PEOPLE.includes(trade.name) && (
                  <span
                    style={{
                      background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "999px",
                    }}
                  >
                    Followed
                  </span>
                )}
              </div>

              <p style={{ color: "#475569", marginBottom: "6px" }}>
                <strong>Role:</strong> {trade.role || "—"}
              </p>
              <p style={{ color: "#475569", marginBottom: "6px" }}>
                <strong>Ticker:</strong> {trade.symbol || "—"}
              </p>
              <p style={{ color: "#475569", marginBottom: "6px" }}>
                <strong>Type:</strong>{" "}
                <span
                  style={{
                    color: "#fff",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: typeColors[trade.transactionType] || "#94a3b8",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  {trade.transactionType || "—"}
                </span>
              </p>
              <p style={{ color: "#475569", marginBottom: "6px" }}>
                <strong>Shares:</strong> {trade.shares || "—"}
              </p>
              <p style={{ color: "#475569", marginBottom: "6px" }}>
                <strong>Price:</strong> {trade.price || "—"}
              </p>
              <p style={{ color: "#475569", fontSize: "0.875rem" }}>
                <strong>Date:</strong> {trade.date || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
