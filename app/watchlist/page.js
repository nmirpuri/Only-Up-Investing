"use client";

import { useState, useEffect } from "react";

/* ============================
   STYLES
============================ */
const styles = {
  container: {
    color: "#2596be",
    maxWidth: 1100,
    margin: "40px auto",
    fontFamily: "system-ui",
  },

  title: { fontSize: 34, marginBottom: 5 },
  subtitle: { color: "#666", marginBottom: 20 },

  card: {
    background: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ddd",
  },

  button: {
    width: "100%",
    padding: 10,
    background: "black",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  folder: {
    marginBottom: 25,
    borderBottom: "1px solid #eee",
    paddingBottom: 10,
  },

  folderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 15,
    marginTop: 15,
  },

  stockCard: {
    background: "#fff",
    padding: 12,
    borderRadius: 8,
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
  },

  deleteBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
};

/* ============================
   COMPONENT
============================ */
export default function Watchlist() {
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState("");
  const [symbol, setSymbol] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [activeFolder, setActiveFolder] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ============================
     LOAD / SAVE
  ============================ */
  useEffect(() => {
    const saved = localStorage.getItem("onlyup-folders");
    if (saved) setFolders(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("onlyup-folders", JSON.stringify(folders));
  }, [folders]);

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
     FOLDER LOGIC
  ============================ */
  function addFolder() {
    if (!newFolder) return;

    setFolders((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newFolder,
        stocks: [],
      },
    ]);

    setNewFolder("");
  }

  function deleteFolder(id) {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    if (activeFolder === id) setActiveFolder(null);
  }

  function toggleFolder(id) {
    setActiveFolder((prev) => (prev === id ? null : id));
  }

  /* ============================
     ADD STOCK
  ============================ */
  async function addStock() {
    if (!symbol || !selectedFolder) return;

    setLoading(true);

    const price = await fetchPrice(symbol.toUpperCase());
    if (!price) {
      setLoading(false);
      return;
    }

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === selectedFolder
          ? {
              ...folder,
              stocks: [
                ...folder.stocks,
                {
                  id: crypto.randomUUID(),
                  symbol: symbol.toUpperCase(),
                  initialPrice: price,
                  currentPrice: price,
                  targetPrice: null,
                },
              ],
            }
          : folder
      )
    );

    setSymbol("");
    setLoading(false);
  }

  /* ============================
     DELETE STOCK
  ============================ */
  function removeStock(folderId, stockId) {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              stocks: folder.stocks.filter((s) => s.id !== stockId),
            }
          : folder
      )
    );
  }

  /* ============================
     REFRESH PRICES
  ============================ */
  async function refreshPrices() {
    const updated = await Promise.all(
      folders.map(async (folder) => {
        const stocks = await Promise.all(
          folder.stocks.map(async (stock) => {
            const price = await fetchPrice(stock.symbol);
            return {
              ...stock,
              currentPrice: price ?? stock.currentPrice,
            };
          })
        );
        return { ...folder, stocks };
      })
    );

    setFolders(updated);
  }

  useEffect(() => {
    if (folders.length === 0) return;
    const interval = setInterval(refreshPrices, 60000);
    return () => clearInterval(interval);
  }, [folders]);

  /* ============================
     UI
  ============================ */
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Watchlist</h1>
      <p style={styles.subtitle}>Organize stocks into folders.</p>

      {/* CREATE FOLDER */}
      <div style={styles.card}>
        <input
          placeholder="New Folder Name"
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
          style={styles.input}
        />
        <button onClick={addFolder} style={styles.button}>
          Create Folder
        </button>
      </div>

      {/* ADD STOCK */}
      <div style={styles.card}>
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Folder</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Symbol (AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={styles.input}
        />

        <button onClick={addStock} style={styles.button}>
          {loading ? "Adding..." : "Add Stock"}
        </button>
      </div>

      <button onClick={refreshPrices} style={{ marginBottom: 20 }}>
        Refresh Prices
      </button>

      {/* FOLDERS */}
      {folders.map((folder) => (
        <div key={folder.id} style={styles.folder}>
          <div
            style={styles.folderHeader}
            onClick={() => toggleFolder(folder.id)}
          >
            <h2>
              {activeFolder === folder.id ? "▼" : "▶"} {folder.name}
            </h2>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(folder.id);
              }}
              style={styles.deleteBtn}
            >
              ✕
            </button>
          </div>

          {activeFolder === folder.id && (
            <div style={styles.grid}>
              {folder.stocks.map((stock) => {
                const change = stock.currentPrice - stock.initialPrice;
                const percent = (change / stock.initialPrice) * 100;
                const targetHit =
                  stock.targetPrice &&
                  stock.currentPrice >= stock.targetPrice;

                return (
                  <div key={stock.id} style={styles.stockCard}>
                    <div style={styles.row}>
                      <strong>{stock.symbol}</strong>
                      <button
                        onClick={() =>
                          removeStock(folder.id, stock.id)
                        }
                        style={styles.deleteBtn}
                      >
                        ✕
                      </button>
                    </div>

                    <p>Added: ${stock.initialPrice.toFixed(2)}</p>
                    <p>Now: ${stock.currentPrice?.toFixed(2) || "—"}</p>

                    <p style={{ color: change >= 0 ? "green" : "red" }}>
                      {change >= 0 ? "+" : "-"}$
                      {Math.abs(change).toFixed(2)} (
                      {percent.toFixed(2)}%)
                    </p>

                    {/* MINI CHART */}
                    <div style={{ marginTop: 10 }}>
                      {/* Replace this with dynamic chart widget later if needed */}
                      <small style={{ color: "#999" }}>
                        Chart preview
                      </small>
                    </div>

                    {/* TARGET INPUT */}
                    <input
                      type="number"
                      placeholder="Target Price"
                      value={stock.targetPrice || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        setFolders((prev) =>
                          prev.map((f) =>
                            f.id === folder.id
                              ? {
                                  ...f,
                                  stocks: f.stocks.map((s) =>
                                    s.id === stock.id
                                      ? {
                                          ...s,
                                          targetPrice: value
                                            ? Number(value)
                                            : null,
                                        }
                                      : s
                                  ),
                                }
                              : f
                          )
                        );
                      }}
                      style={styles.input}
                    />

                    {/* TARGET HIT */}
                    {targetHit && (
                      <p style={{ color: "green", fontWeight: "bold" }}>
                        🎯 Target Hit!
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
