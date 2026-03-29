"use client";

import { useState, useEffect } from "react";

/* ============================
   STYLES (reuse yours mostly)
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
  card: { background: "#f9f9f9", padding: 20, borderRadius: 10, marginBottom: 25 },
  input: { width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ddd" },
  button: { width: "100%", padding: 12, background: "black", color: "white", border: "none", borderRadius: 6, cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 },
  stockCard: { background: "#fff", padding: 15, borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  deleteBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: 16 },
};

/* ============================
   COMPONENT
============================ */
export default function Watchlist() {
  const [symbol, setSymbol] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ============================
     LOAD FROM LOCAL STORAGE
  ============================ */
  useEffect(() => {
    const saved = localStorage.getItem("onlyup-watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  /* ============================
     SAVE
  ============================ */
  useEffect(() => {
    localStorage.setItem("onlyup-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  /* ============================
     FETCH PRICE
  ============================ */
  async function fetchPrice(symbol) {
    try {
      const res = await fetch(`/api/stock?symbol=${symbol}`);
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
    if (!symbol) return;

    setLoading(true);
    const price = await fetchPrice(symbol.toUpperCase());

    if (!price) {
      setLoading(false);
      return;
    }

    setWatchlist((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        symbol: symbol.toUpperCase(),
        price,
      },
    ]);

    setSymbol("");
    setLoading(false);
  }

  /* ============================
     DELETE
  ============================ */
  function removeStock(id) {
    setWatchlist((prev) => prev.filter((s) => s.id !== id));
  }

  /* ============================
     REFRESH PRICES
  ============================ */
  async function refreshPrices() {
    const updated = await Promise.all(
      watchlist.map(async (stock) => {
        const price = await fetchPrice(stock.symbol);
        return {
          ...stock,
          price: price ?? stock.price,
        };
      })
    );

    setWatchlist(updated);
  }

  useEffect(() => {
    if (watchlist.length === 0) return;
    const interval = setInterval(refreshPrices, 60000);
    return () => clearInterval(interval);
  }, [watchlist]);

  /* ============================
     UI
  ============================ */
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Watchlist</h1>
      <p style={styles.subtitle}>Track stocks before buying.</p>

      <div style={styles.card}>
        <input
          placeholder="Symbol (TSLA)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={styles.input}
        />
        <button onClick={addStock} style={styles.button}>
          {loading ? "Adding..." : "Add to Watchlist"}
        </button>
      </div>

      <button onClick={refreshPrices} style={{ marginBottom: 20 }}>
        Refresh Prices
      </button>

      <div style={styles.grid}>
        {watchlist.map((stock) => (
          <div key={stock.id} style={styles.stockCard}>
            <div style={styles.row}>
              <strong>{stock.symbol}</strong>
              <button onClick={() => removeStock(stock.id)} style={styles.deleteBtn}>
                ✕
              </button>
            </div>

            <p>Price: ${stock.price?.toFixed(2) || "—"}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
