"use client";

import { useEffect, useState } from "react";

export default function NewsPage() {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("onlyup-portfolio");
    if (!saved) return;

    const parsed = JSON.parse(saved);
    const stocks = parsed.stocks || [];

    const uniqueSymbols = [
      ...new Set(stocks.map((s) => s.symbol)),
    ];

    setSymbols(uniqueSymbols);
  }, []);

  return (
    <main>
      <h1>My News</h1>

      {symbols.length === 0 ? (
        <p>No stocks in portfolio.</p>
      ) : (
        <ul>
          {symbols.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
