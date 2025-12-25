"use client";
import { useState } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [portfolio, setPortfolio] = useState([]);

  async function addStock() {
    if (!symbol) return;

    const res = await fetch(`/api/price?symbol=${symbol}`);
    const data = await res.json();

    // Add new stock to portfolio
    setPortfolio((prev) => [...prev, data]);
    setSymbol("");
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>Only Up (Hello Aakash)</h1>
      <p style={{ marginTop: "12px", fontSize: "18px" }}>
        Track your stock portfolio. See how much you’re up.
      </p>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter stock symbol e.g. AAPL"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={{ padding: "8px", fontSize: "16px" }}
        />
        <button
          onClick={addStock}
          style={{ padding: "8px 12px", marginLeft: "8px", fontSize: "16px" }}
        >
          Add Stock
        </button>
      </div>


<!-- PORTFOLIO SECTION____________ -->

      {portfolio.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Portfolio</h2>
          <ul>
            {portfolio.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h2>Portfolio</h2>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {portfolio.map((stock, index) => (
        <li
          key={index}
          style={{
            marginBottom: "12px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <strong>{stock.symbol}</strong> - ${stock.price} (
          <span style={{ color: stock.change >= 0 ? "green" : "red" }}>
            {stock.change}%
          </span>
          )
        </li>
      ))}
    </ul>

    {/* Total gains/losses */}
    <div style={{ marginTop: "20px", fontSize: "18px" }}>
      Total Change:{" "}
      <span
        style={{
          color:
            portfolio.reduce((acc, s) => acc + s.change, 0) >= 0
              ? "green"
              : "red",
        }}
      >
        {portfolio.reduce((acc, s) => acc + s.change, 0).toFixed(2)}%
      </span>
    </div>
  </div>
)}
          </ul>
        </div>
      )}
    </main>
  );
}
