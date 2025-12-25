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
<ul>
{portfolio.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Portfolio</h2>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {portfolio.map((stock, index) => (
        <div
          key={index}
          style={{
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            minWidth: "180px",
            flex: "1 1 180px",
            backgroundColor: "#f9f9f9",
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
    <div style={{ marginTop: "24px", fontSize: "18px" }}>
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
