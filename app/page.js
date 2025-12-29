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
      <div style={{ background: "#2596be", minHeight: "100vh", padding: 40 }}>
    <main style={styles.container}>
      <h1 style={styles.title}>Only Up Investing</h1>
      <p style={styles.subtitle}>
       The Sky is the Limit
      </p>



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
    const gain =
      (stock.currentPrice - stock.buyPrice) * stock.shares;

    return (
      <div key={stock.id} style={styles.stockCard}>
        <div style={styles.stockHeader}>
          <strong>{stock.symbol}</strong>
          <button
            onClick={() => deleteStock(stock.id)}
            style={styles.deleteBtn}
          >
            ✕
          </button>
        </div>
        <p style={styles.stockText}>Bought: ${stock.buyPrice}</p>
        <p style={styles.stockText}>Shares: {stock.shares}</p>
        <p style={styles.stockText}>
          Current: ${stock.currentPrice.toFixed(2)}
        </p>
        <p
          style={{
            color: gain >= 0 ? "#22c55e" : "#f87171",
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
          marginTop: 20,
          color: totalGain >= 0 ? "green" : "red",
        }}
      >
        Total Gain / Loss: {totalGain >= 0 ? "+" : "-"}$
        {Math.abs(totalGain).toFixed(2)}
      </h3>
    </main>
  </div>
  );
}

/* ============================
   STYLES
============================ */
const styles = {
  // ===== Page background =====
  pageWrapper: {
    background: "#f5f7fa", // very light gray-blue
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
    color: "#111827", // default dark text
  },

  // ===== Main container =====
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  // ===== Titles =====
  title: {
    fontSize: 40,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 6,
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280", // muted gray for subtitle
    textAlign: "center",
    marginBottom: 30,
  },

  // ===== Notices =====
  notice: {
    background: "#e0f2fe", // soft blue
    padding: 14,
    borderRadius: 10,
    marginBottom: 30,
    fontSize: 14,
    textAlign: "center",
    cursor: "pointer",
    fontWeight: 500,
    color: "#0c4a6e",
    transition: "background 0.2s ease",
  },
  noticeHover: {
    background: "#bae6fd",
  },

  // ===== Input + Form =====
  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#111827",
    fontSize: 14,
    outline: "none",
  },
  button: {
    width: "100%",
    padding: 14,
    background: "#2563eb", // vibrant blue
    color: "#ffffff",
    fontWeight: 600,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    transition: "background 0.2s ease",
  },
  buttonHover: {
    background: "#1e40af", // darker blue on hover
  },

  // ===== Portfolio Section =====
  refreshRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  refreshBtn: {
    padding: "6px 12px",
    fontSize: 12,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    color: "#2563eb",
    background: "#e0f2fe",
    fontWeight: 600,
  },

  error: {
    color: "#dc2626", // red for errors
    marginTop: 10,
    fontWeight: 600,
  },

  portfolioGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },

  stockCard: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  stockCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
  },

  stockHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#dc2626",
    fontWeight: "700",
  },
  stockText: {
    fontSize: 14,
    marginBottom: 6,
    color: "#111827",
  },
  gainText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  // ===== Total Gain / Loss =====
  totalGain: {
    marginTop: 20,
    fontWeight: 700,
    fontSize: 18,
  },
};

