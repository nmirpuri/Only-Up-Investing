"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

/* ============================
   HELPERS
============================ */
function generateAnonId() {
  return "anon_" + crypto.randomUUID();
}

export default function Home() {
  /* ============================
     AUTH STATE
  ============================ */
  const [authView, setAuthView] = useState(null); // null | signin | signup
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ============================
     PORTFOLIO STATE
  ============================ */
  const [userId, setUserId] = useState(null);
  const [symbol, setSymbol] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [shares, setShares] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState("");
  const [loadingPrices, setLoadingPrices] = useState(false);

  /* ============================
     INIT AUTH
  ============================ */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

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
      JSON.stringify({ userId, stocks: portfolio })
    );
  }, [portfolio, userId]);

  /* ============================
     AUTH FUNCTIONS
  ============================ */
const signUp = async () => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name, // 👈 this is the important line
      },
    },
  });

  if (error) {
    alert(error.message);
  }
};

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      setAuthView(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  /* ============================
     STOCK FUNCTIONS
  ============================ */
  async function fetchPrice(stock) {
    try {
      const res = await fetch(`/api/stock?symbol=${stock}`);
      const data = await res.json();
      return typeof data.price === "number" ? data.price : null;
    } catch {
      return null;
    }
  }

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

  function deleteStock(id) {
    setPortfolio((prev) => prev.filter((s) => s.id !== id));
  }

  async function refreshPrices() {
    setLoadingPrices(true);
    const updated = await Promise.all(
      portfolio.map(async (stock) => ({
        ...stock,
        currentPrice:
          (await fetchPrice(stock.symbol)) ?? stock.currentPrice,
      }))
    );
    setPortfolio(updated);
    setLoadingPrices(false);
  }

  /* ============================
     CALCULATIONS
  ============================ */
  const totalGain = portfolio.reduce(
    (acc, s) => acc + (s.currentPrice - s.buyPrice) * s.shares,
    0
  );

  /* ============================
     AUTH SCREENS
  ============================ */
  const renderSignIn = () => (
    <div style={styles.authCard}>
      <h1>Sign In</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
   
      <button style={styles.button} onClick={signIn}>Sign In</button>
      <p style={styles.link} onClick={() => setAuthView("signup")}>Create an account</p>
      <p style={styles.link} onClick={() => setAuthView(null)}>← Back</p>
    </div>
  );

  const renderSignUp = () => (
    <div style={styles.authCard}>
      <h1>Create Account</h1>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
      <button style={styles.button} onClick={signUp}>Create Account</button>
      <p style={styles.link} onClick={() => setAuthView("signin")}>Already have an account?</p>
      <p style={styles.link} onClick={() => setAuthView(null)}>← Back</p>
    </div>
  );

  /* ============================
     UI
  ============================ */
  return (
    <main style={styles.container}>
      {authView === null && (
        <>
          <h1 style={styles.title}>Only Up 📈</h1>

          {user ? (
            <>
              <h2>{user.user_metadata?.name || "User"}’s Portfolio</h2>
              <button style={styles.secondaryBtn} onClick={signOut}>Log Out</button>
            </>
          ) : (
            <button style={styles.button} onClick={() => setAuthView("signin")}>
              Sign In
            </button>
          )}

          <div style={styles.card}>
            <input placeholder="Symbol (AAPL)" value={symbol} onChange={(e) => setSymbol(e.target.value)} style={styles.input} />
            <input placeholder="Bought at $" type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} style={styles.input} />
            <input placeholder="Shares" type="number" value={shares} onChange={(e) => setShares(e.target.value)} style={styles.input} />
            <button onClick={addStock} style={styles.button}>Add</button>
            {error && <p style={styles.error}>{error}</p>}
          </div>

          {portfolio.map((stock) => (
            <div key={stock.id} style={styles.stockCard}>
              <strong>{stock.symbol}</strong>
              <p>${stock.currentPrice.toFixed(2)}</p>
            </div>
          ))}

          <h3>Total Gain / Loss: ${totalGain.toFixed(2)}</h3>
        </>
      )}

      {authView === "signin" && renderSignIn()}
      {authView === "signup" && renderSignUp()}
    </main>
  );
}

/* ============================
   STYLES
============================ */
const styles = {
  container: { maxWidth: 520, margin: "40px auto", fontFamily: "system-ui" },
  title: { fontSize: 36, marginBottom: 20 },
  card: { background: "#f9f9f9", padding: 20, borderRadius: 10, marginBottom: 20 },
  authCard: { background: "#fff", padding: 25, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  input: { width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ddd" },
  button: { width: "100%", padding: 12, background: "black", color: "white", border: "none", borderRadius: 6, cursor: "pointer" },
  secondaryBtn: { marginTop: 10, padding: 8 },
  stockCard: { background: "#fff", padding: 12, borderRadius: 8, marginBottom: 10 },
  error: { color: "red" },
  link: { cursor: "pointer", color: "#0070f3", marginTop: 10 },
};
