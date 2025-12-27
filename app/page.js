import { supabase } from "../lib/supabase";

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
     INIT Profile Creation USER
  ============================ */
const [user, setUser] = useState(null);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [authLoading, setAuthLoading] = useState(false);

   
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
     Detect Logged in User
  ============================ */ 
   useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);

async function signUp() {
  setAuthLoading(true);
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) alert(error.message);
  setAuthLoading(false);
}

async function signIn() {
  setAuthLoading(true);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) alert(error.message);
  setAuthLoading(false);
}

async function signOut() {
  await supabase.auth.signOut();
}

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
   <div style={styles.authBox}>
  {!user ? (
    <>
      <h3>Sign in or create an account</h3>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={signIn} style={styles.button}>
        Sign In
      </button>
      <button onClick={signUp} style={styles.secondaryBtn}>
        Sign Up
      </button>
    </>
  ) : (
    <>
      <p>Logged in as <strong>{user.email}</strong></p>
      <button onClick={signOut} style={styles.secondaryBtn}>
        Log Out
      </button>
    </>
  )}
</div>

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Only Up</h1>
      <p style={styles.subtitle}>
        Track gains instantly
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
authBox: {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  marginBottom: 20,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
},
secondaryBtn: {
  width: "100%",
  padding: 10,
  marginTop: 8,
  background: "#f0f0f0",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
},

const styles = {
  container: {
    maxWidth: 520,
    margin: "40px auto",
    fontFamily: "system-ui",
  },
  title: {
    fontSize: 36,
    marginBottom: 5,
  },
  subtitle: {
    color: "#666",
    marginBottom: 10,
  },
  notice: {
    background: "#eef6ff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 14,
  },
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
    padding: 12,
    background: "black",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  refreshRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  refreshBtn: {
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: 6,
    border: "1px solid #ddd",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  stockCard: {
    background: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  stockHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
  },
};
