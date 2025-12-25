"use client"; // needed for client-side interactivity
import { useState } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);

  async function fetchPrice() {
    const res = await fetch(`/api/price?symbol=${symbol}`);
    const json = await res.json();
    setData(json);
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>Only Up (Hello Aakash)</h1>
      <p style={{ marginTop: "12px", fontSize: "18px" }}>
        Track your stock portfolio. See how much you’re up.
      </p>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter stock symbol e.g. AAPL"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={{ padding: "8px", fontSize: "16px" }}
        />
        <button
          onClick={fetchPrice}
          style={{ padding: "8px 12px", marginLeft: "8px", fontSize: "16px" }}
        >
          Add Stock
        </button>
      </div>

      {data && (
        <div style={{ marginTop: "20px" }}>
          <p>Symbol: {data.symbol}</p>
          <p>Price: ${data.price}</p>
          <p>Change: {data.change}%</p>
        </div>
      )}
    </main>
  );
}
