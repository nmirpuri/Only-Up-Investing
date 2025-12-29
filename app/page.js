"use client";

import { useState, useEffect } from "react";

/* ============================
   HELPERS
============================ */
function generateAnonId() {
  return "anon_" + crypto.randomUUID();
}

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [symbol, setSymbol] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [shares, setShares] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState("");
  const [loadingPrices, setLoadingPrices] = useState(false);

  /* ============================
     INIT ANONYMOUS USER
  ============================ */
  useEffect(() => {
    let storedUserId = localStorage.getItem("onlyup-user-id");

    if (!storedUserId) {
      storedUserId = generateAnonId();
      localStorage.setItem("onlyup-user-id", storedUserId);
    }

    setUserId(storedUserId);

    const saved = localStorage.getItem("onlyup-portfolio");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.userId === storedUserId) {
        setPortfolio(parsed.stocks || []);
      }
    }
  }, []);

  /* ============================
     SAVE PORTFOLIO
  ============================ */
  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      "onlyup-portfolio",
      JSON.stringify({
        userId,
        stocks: portfolio,
      })
    );
  }, [portfolio, userId]);

  /* ============================
     FETCH STOCK PRICE
  ============================ */
  async function fetchPrice(stock) {
    try {
      const res = await fetch(`/api/stock?symbol=${stock}`);
      const data = await res.json();
      return data.price;
    } catch {
      return null;
    }
  }

  /* ============================
     ADD STOCK
  ============================ */
  async function addStock() {
    setError("");

    if (!symbol || !buyPrice || !shares) {
      setError("Fill all fields.");
      return;
    }

    const price = await fetchPrice(symbol.toUpperCase());

    if (!price) {
      setError("Could not fetch stock price.");
      return;
    }

    setPortfolio((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        symbol: symbol.toUpperCase(),
        buyPrice: Number(buyPrice),
        shares: Number(shares),
        currentPrice: price,
      },
    ]);

    setSymbol("");
    setBuyPrice("");
    setShares("");
  }

  /* ============================
     DELETE STOCK
  ============================ */
  function deleteStock(id) {
    setPortfolio((prev) => prev.filter((s) => s.id !== id));
  }

  /* ============================
     REFRESH PRICES
  ============================ */
  async function refreshPrices() {
    setLoadingPrices(true);

    const updated = await Promise.all(
      portfolio.map(async (stock) => {
        const price = await fetchPrice(stock.symbol);
        return {
          ...stock,
          currentPrice: price ?? stock.currentPrice,
        };
      })
    );

    setPortfolio(updated);
    setLoadingPrices(false);
  }

  /* ============================
     AUTO REFRESH (60s)
  ============================ */
  useEffect(() => {
    if (portfolio.length === 0) return;

    const interval = setInterval(() => {
      refreshPrices();
    }, 60000);

    return () => clearInterval(interval);
  }, [portfolio]);

  /* ============================
     CALCULATIONS
  ============================ */
  const totalGain = portfolio.reduce((acc, stock) => {
    return (
      acc +
      (stock.currentPrice - stock.buyPrice) * stock.shares
    );
  }, 0);

  /* ============================
     UI
  ============================ */
  return (
<div style={styles.pageWrapper}>
  <main style={styles.container}>
    <h1 style={styles.title}>Only Up (Hi)</h1>
    <p style={styles.subtitle}>
      Real-time portfolio tracking. Exact gains. No fluff.
    </p>

    <div style={styles.addStockRow}>
      <input
        placeholder="Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Bought at $"
        type="number"
        value={buyPrice}
        onChange={(e) => setBuyPrice(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Shares"
        type="number"
        value={shares}
        onChange={(e) => setShares(e.target.value)}
        style={styles.input}
      />
      <button onClick={addStock} style={styles.addButton}>
        Add
      </button>
    </div>

    <h2 style={styles.portfolioTitle}>Portfolio</h2>

    <div style={styles.portfolioGrid}>
      {portfolio.map((stock) => {
        const gain = (stock.currentPrice - stock.buyPrice) * stock.shares;
        return (
          <div key={stock.id} style={styles.stockCard}>
            <strong>{stock.symbol}</strong>
            <p>Bought: ${stock.buyPrice}</p>
            <p>Shares: {stock.shares}</p>
            <p>Current: ${stock.currentPrice.toFixed(2)}</p>
            <p
              style={{
                color: gain >= 0 ? "#22c55e" : "#dc2626",
                fontWeight: "bold",
              }}
            >
              {gain >= 0 ? "+" : "-"}${Math.abs(gain).toFixed(2)}
            </p>
          </div>
        );
      })}
    </div>

    <h3
      style={{
        ...styles.totalGain,
        color: totalGain >= 0 ? "#22c55e" : "#dc2626",
      }}
    >
      Total Gain / Loss: {totalGain >= 0 ? "+" : "-"}$
      {Math.abs(totalGain).toFixed(2)}
    </h3>
  </main>
</div>


/* ============================
   STYLES
============================ */
const styles = {
  pageWrapper: {
    background: "#f3f4f6", // light gray/blue
    minHeight: "100vh",
    padding: 40,
    fontFamily: "'Inter', sans-serif",
    color: "#111827",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 30,
  },
  addStockRow: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #d1d5db",
    fontSize: 14,
    width: 120,
  },
  addButton: {
    padding: "10px 20px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  portfolioTitle: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 20,
  },
  portfolioGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 20,
    justifyItems: "center",
  },
  stockCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 220,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  totalGain: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 30,
  },
};
