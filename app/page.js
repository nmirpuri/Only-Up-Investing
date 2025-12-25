"use client";
import { useState } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [portfolio, setPortfolio] = useState([]);

  async function addStock() {
    if (!symbol) return;

    const res = await fetch(`/api/price?symbol=${symbol}`);
    const data = await res.json();

    setPortfolio((prev) => [...prev, data]);
    setSymbol("");
  }

  const totalChange = portfolio.reduce((acc, s) => acc + s.change, 0).toFixed(2);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', sans-serif",
        background: "linear-gradient(to bottom, #f0f4f8, #d9e2ec)"
      }}
    >
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "48px", margin: 0, fontWeight: "bold" }}>Only Up (Hi Cash)</h1>
        <p style={{ marginTop: "8px", fontSize: "18px", color: "#555" }}>
          Track your stocks and see your gains rise.
        </p>
      </header>

      {/* Input */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <input
          type="text"
          placeholder="Enter stock symbol e.g. AAPL"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={{
            padding: "12px 16px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "200px",
            marginRight: "8px",
            outline: "none"
          }}
        />
        <button
          onClick={addStock}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#0070f3",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Add Stock
        </button>
      </div>

      {/* Portfolio */}
      {portfolio.length > 0 && (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "16px", textAlign: "center" }}>Portfolio</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            {portfolio.map((stock, index) => (
              <div
                key={index}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  minWidth: "160px",
                  flex: "1 1 160px",
                  backgroundColor: "#fff",
                  textAlign: "center"
                }}
              >
                <h3 style={{ margin: 0 }}>{stock.symbol}</h3>
                <p style={{ margin: "8px 0" }}>Price: ${stock.price}</p>
                <p style={{ margin: 0, color: stock.change >= 0 ? "green" : "red" }}>
                  Change: {stock.change}%
                </p>
              </div>
            ))}
          </div>

          {/* Total gains/losses */}
          <div style={{ marginTop: "32px", fontSize: "20px", textAlign: "center" }}>
            Total Change:{" "}
            <span style={{ color: totalChange >= 0 ? "green" : "red" }}>
              {totalChange}%
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
