"use client";
import { useState } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [boughtPrice, setBoughtPrice] = useState("");
  const [portfolio, setPortfolio] = useState([]);

  async function addStock() {
    if (!symbol || !boughtPrice) return;

    try {
      const res = await fetch(`/api/price?symbol=${symbol}`);
      const data = await res.json();

      const currentPrice = data.price;
      const gainLoss = Math.round((currentPrice - parseFloat(boughtPrice)) * 100) / 100;

      setPortfolio((prev) => [
        ...prev,
        {
          symbol: symbol.toUpperCase(),
          boughtPrice: parseFloat(boughtPrice),
          currentPrice,
          gainLoss,
        },
      ]);

      setSymbol("");
      setBoughtPrice("");
    } catch (err) {
      console.error("Failed to fetch price", err);
    }
  }

  const totalGainLoss = portfolio.reduce((acc, s) => acc + s.gainLoss, 0).toFixed(2);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', sans-serif",
        background: "linear-gradient(to bottom, #f0f4f8, #d9e2ec)",
      }}
    >
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "48px", margin: 0, fontWeight: "bold" }}>Only Up</h1>
        <p style={{ marginTop: "8px", fontSize: "18px", color: "#555" }}>
          Track your stocks and see your gains rise.
        </p>
      </header>

      {/* Inputs */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <input
          type="text"
          placeholder="Stock symbol e.g. AAPL"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={{
            padding: "12px 16px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "140px",
            marginRight: "8px",
            outline: "none",
          }}
        />
        <input
          type="number"
          placeholder="Bought at $"
          value={boughtPrice}
          onChange={(e) => setBoughtPrice(e.target.value)}
          style={{
            padding: "12px 16px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "120px",
            marginRight: "8px",
            outline: "none",
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
            fontWeight: "bold",
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
                  textAlign: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>{stock.symbol}</h3>
                <p style={{ margin: "8px 0" }}>Bought: ${stock.boughtPrice}</p>
                <p style={{ margin: "8px 0" }}>Current: ${stock.currentPrice}</p>
                <p style={{ margin: 0, color: stock.gainLoss >= 0 ? "green" : "red" }}>
                  {stock.gainLoss >= 0 ? "+" : ""}
                  ${stock.gainLoss}
                </p>
              </div>
            ))}
          </div>

          {/* Total gains/losses */}
          <div style={{ marginTop: "32px", fontSize: "20px", textAlign: "center" }}>
            Total Gain/Loss:{" "}
            <span style={{ color: totalGainLoss >= 0 ? "green" : "red" }}>
              {totalGainLoss}
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
