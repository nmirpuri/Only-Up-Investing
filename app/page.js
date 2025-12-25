"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [boughtPrice, setBoughtPrice] = useState("");
  const [shares, setShares] = useState("");
  const [portfolio, setPortfolio] = useState([]);

  async function fetchPrice(stockSymbol) {
    const res = await fetch(`/api/price?symbol=${stockSymbol}`);
    return res.json();
  }

  async function addStock() {
    if (!symbol || !boughtPrice || !shares) return;

    const data = await fetchPrice(symbol);
    const currentPrice = data.price;

    const gainLoss =
      (currentPrice - parseFloat(boughtPrice)) * parseFloat(shares);

    setPortfolio((prev) => [
      ...prev,
      {
        symbol: symbol.toUpperCase(),
        boughtPrice: parseFloat(boughtPrice),
        shares: parseFloat(shares),
        currentPrice,
        gainLoss,
      },
    ]);

    setSymbol("");
    setBoughtPrice("");
    setShares("");
  }

  // 🔁 REAL-TIME UPDATES EVERY 30 SECONDS
  useEffect(() => {
    if (portfolio.length === 0) return;

    const interval = setInterval(async () => {
      const updatedPortfolio = await Promise.all(
        portfolio.map(async (stock) => {
          const data = await fetchPrice(stock.symbol);
          const currentPrice = data.price;

          const gainLoss =
            (currentPrice - stock.boughtPrice) * stock.shares;

          return {
            ...stock,
            currentPrice,
            gainLoss,
          };
        })
      );

      setPortfolio(updatedPortfolio);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [portfolio]);

  const totalGainLoss = portfolio
    .reduce((acc, s) => acc + s.gainLoss, 0)
    .toFixed(2);

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
        <h1 style={{ fontSize: "48px", margin: 0 }}>Only Up</h1>
        <p style={{ fontSize: "18px", color: "#555" }}>
          Real-time portfolio tracking. Exact gains. No fluff.
        </p>
      </header>

      {/* Inputs */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <input
          placeholder="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Bought at $"
          value={boughtPrice}
          onChange={(e) => setBoughtPrice(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Shares"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          style={inputStyle}
        />
        <button onClick={addStock} style={buttonStyle}>
          Add
        </button>
      </div>

      {/* Portfolio */}
      {portfolio.length > 0 && (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Portfolio
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            {portfolio.map((stock, index) => (
              <div key={index} style={cardStyle}>
                <h3>{stock.symbol}</h3>
                <p>Bought: ${stock.boughtPrice}</p>
                <p>Shares: {stock.shares}</p>
                <p>Current: ${stock.currentPrice}</p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: stock.gainLoss >= 0 ? "green" : "red",
                  }}
                >
                  {stock.gainLoss >= 0 ? "+" : "-"}$
                  {Math.abs(stock.gainLoss).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "30px",
              fontSize: "22px",
              textAlign: "center",
              fontWeight: "bold",
              color: totalGainLoss >= 0 ? "green" : "red",
            }}
          >
            Total Gain / Loss: ${totalGainLoss}
          </div>
        </div>
      )}
    </main>
  );
}

// 🎨 Styles
const inputStyle = {
  padding: "12px",
  marginRight: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "120px",
};

const buttonStyle = {
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#0070f3",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  minWidth: "180px",
  textAlign: "center",
};
