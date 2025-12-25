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

      {portfolio.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Portfolio</h2>
          <ul>
            {portfolio.map((stock, index) => (
              <li key={index} style={{ marginBottom: "12px" }}>
                <strong>{stock.symbol}</strong> - ${stock.price} ({stock.change}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
