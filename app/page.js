"use client";

import Link from "next/link";

import { useState, useEffect } from "react";

/* ============================
   STYLES
============================ */
const styles = {
  container: {
   color: "#2596be",
    maxWidth: 1200,
    margin: "40px auto",
    fontFamily: "system-ui",
  },
  title: { fontSize: 36, marginBottom: 5 },
  subtitle: { color: "#666", marginBottom: 10 },
  notice: {
    background: "#eef6ff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 14,
  },
  card: { background: "#f9f9f9", padding: 20, borderRadius: 10, marginBottom: 25 },
  input: { width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ddd" },
  button: { width: "100%", padding: 12, background: "black", color: "white", border: "none", borderRadius: 6, cursor: "pointer" },
  refreshRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  refreshBtn: { padding: "6px 10px", fontSize: 12, borderRadius: 6, border: "1px solid #ddd", cursor: "pointer" },
  error: { color: "red", marginTop: 10 },
  portfolioGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginTop: 20 },
  stockCard: { background: "#fff", padding: 15, borderRadius: 8, marginBottom: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  stockHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  deleteBtn: { background: "transparent", border: "none", fontSize: 16, cursor: "pointer" },
  stockText: { margin: "5px 0" },
};

/* ============================
   HELPERS
============================ */
function generateAnonId() {
  return "anon_" + crypto.randomUUID();
}

export default function Home() {
  /* ============================
     STATE
  ============================ */
  const [userId, setUserId] = useState(null);
  const [symbol, setSymbol] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [shares, setShares] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState("");
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [buyDate, setBuyDate] = useState("");

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
      if (!data || typeof data.price !== "number") return null;
      return data.price;
    } catch (err) {
      console.error("Fetch price error:", err);
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
        buyDate: buyDate || null,
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

    const interval = setInterval(refreshPrices, 60000);
    return () => clearInterval(interval);
  }, [portfolio]);

  /* ============================
     CALCULATIONS
  ============================ */
  const totalGain = portfolio.reduce((acc, stock) => {
    return acc + (stock.currentPrice - stock.buyPrice) * stock.shares;
  }, 0);

  /* ============================
     UI
  ============================ */
  return (
    <main style={styles.container}>


      <h1 style={styles.title}>Only Up</h1>
      <p style={styles.subtitle}>Track gains instantly.</p>

      <div style={styles.notice}>The Sky is the Limit.</div>

      <div style={styles.card}>
        <input
          placeholder="Symbol (AAPL)"
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
        <input
        placeholder="Date (optional)"
        type="date"
        value={buyDate}
        onChange={(e) => setBuyDate(e.target.value)}
        style={styles.input}
        />
        <button onClick={addStock} style={styles.button}>
          Add
        </button>
         
        {error && <p style={styles.error}>{error}</p>}
      </div>

      <div style={styles.refreshRow}>
        <h2>Portfolio</h2>
        <button
          onClick={refreshPrices}
          style={styles.refreshBtn}
          disabled={loadingPrices}
        >
          {loadingPrices ? "Refreshing..." : "Refresh Prices"}
        </button>
      </div>

      <div style={styles.portfolioGrid}>
        {portfolio.map((stock) => {
          const gain = (stock.currentPrice - stock.buyPrice) * stock.shares;
          const percentage = ((stock.currentPrice - stock.buyPrice) * stock.shares) / (stock.shares * stock.buyPrice);
          let daysHeld = null;

if (stock.buyDate) {
  const today = new Date();
  const bought = new Date(stock.buyDate);
  const diffTime = today - bought;
  daysHeld = Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
          return (
            <div key={stock.id} style={styles.stockCard}>
              <div style={styles.stockHeader}>
                <strong>{stock.symbol}</strong>
                <button onClick={() => deleteStock(stock.id)} style={styles.deleteBtn}>
                  ✕
                </button>
              </div>
              <p style={styles.stockText}>Bought: ${stock.buyPrice}</p>
              <p style={styles.stockText}>Shares: {stock.shares}</p>
              <p style={styles.stockText}>
                Current: ${stock.currentPrice ? stock.currentPrice.toFixed(2) : "—"}
              </p>
              <p style={styles.stockText}>
                Percentage: {Math.abs(percentage).toFixed(2) * 100}%
              </p>
              <p style={{ color: gain >= 0 ? "#22c55e" : "#f87171", fontWeight: "bold" }}>
                {gain >= 0 ? "+" : "-"}${Math.abs(gain).toFixed(2)}
              </p>
               {daysHeld !== null && (
  <p style={styles.stockText}>Days Held: {daysHeld}</p>
)}
            </div>
          );
        })}
      </div>

      <h3>Total Gain: ${totalGain.toFixed(2)}</h3>
    </main>
  );
}
