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
    <main style={styles.container}>
      <h1 style={styles.title}>Only Up 📈</h1>
      <p style={styles.subtitle}>
        Track gains instantly. Create an account later.
      </p>

      <div style={styles.notice}>
        You’re using an anonymous portfolio.
        <strong> Create an account</strong> to save forever.
      </div>

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
            <p>Bought: ${stock.buyPrice}</p>
            <p>Shares: {stock.shares}</p>
            <p>Current: ${stock.currentPrice.toFixed(2)}</p>
            <p
              style={{
                color: gain >= 0 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {gain >= 0 ? "+" : "-"}$
              {Math.abs(gain).toFixed(2)}
            </p>
          </div>
        );
      })}

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
  );
}

/* ============================
   STYLES
============================ */
const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(to right, #6a11cb, #2575fc)",
    padding: 20,
    borderRadius: 16,
    color: "#fff",
    minHeight: "100vh",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  notice: {
    background: "rgba(255, 255, 255, 0.15)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 14,
    textAlign: "center",
  },
  card: {
    background: "rgba(255,255,255,0.15)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    transition: "transform 0.2s ease",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: 14,
    background: "#fff",
    color: "#2575fc",
    fontWeight: "600",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    transition: "all 0.2s ease",
  },
  buttonHover: {
    background: "#f1f1f1",
  },
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
    border: "1px solid rgba(255,255,255,0.4)",
    cursor: "pointer",
    color: "#fff",
    background: "transparent",
    transition: "0.2s ease",
  },
  error: {
    color: "#ff6b6b",
    marginTop: 10,
    fontWeight: "600",
  },
  stockCard: {
    background: "rgba(255,255,255,0.1)",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  stockCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.25)",
  },
  stockHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#ff6b6b",
    fontWeight: "700",
  },
};

