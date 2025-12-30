"use client";

import { useEffect, useState } from "react";

export default function NewsPage() {
  const [symbols, setSymbols] = useState([]);
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("onlyup-portfolio");
    if (!saved) return;

    const parsed = JSON.parse(saved);
    const stocks = parsed.stocks || [];
    const uniqueSymbols = [...new Set(stocks.map((s) => s.symbol))];
    setSymbols(uniqueSymbols);
  }, []);

  useEffect(() => {
    if (symbols.length === 0) return;

    const fetchNews = async () => {
      setLoading(true);
      const apiKey = process.env.MARKETAUX_API_KEY; // make sure this is set in .env.local
      const newsData = {};

      for (const symbol of symbols) {
        try {
          const res = await fetch(
            `https://api.marketaux.com/v1/news/all?symbols=${symbol}&filter_entities=true&language=en&api_token=${apiKey}`
          );
          const data = await res.json();
          newsData[symbol] = data.data || [];
        } catch (err) {
          console.error(`Error fetching news for ${symbol}:`, err);
          newsData[symbol] = [];
        }
      }

      setNews(newsData);
      setLoading(false);
    };

    fetchNews();
  }, [symbols]);

  return (
    <main style={{ padding: "20px" }}>
      <h1>My News</h1>

      {symbols.length === 0 && <p>No stocks in portfolio.</p>}

      {loading && <p>Loading news...</p>}

      {symbols.map((s) => (
        <section key={s} style={{ marginBottom: "30px" }}>
          <h2>{s}</h2>
          {news[s] && news[s].length > 0 ? (
            <ul>
              {news[s].map((item, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                  <p>{item.summary}</p>
                  <small>{new Date(item.published_at).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No news found for {s}</p>
          )}
        </section>
      ))}
    </main>
  );
}
