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
      const apiKey = process.env.NEXT_PUBLIC_MARKETAUX_API_KEY;
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
    <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "20px" }}>📈 My Stock News Dashboard</h1>

      {symbols.length === 0 && <p>No stocks in portfolio.</p>}
      {loading && <p>Loading news...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {symbols.map((s) => (
          <div
            key={s}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
            }}
          >
            <h2 style={{ marginBottom: "10px" }}>{s}</h2>
            {news[s] && news[s].length > 0 ? (
              news[s].slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "15px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "10px",
                  }}
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      style={{
                        width: "100%",
                        maxHeight: "150px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: "bold", color: "#0070f3", textDecoration: "none" }}
                  >
                    {item.title}
                  </a>
                  <p style={{ fontSize: "14px", margin: "5px 0" }}>
                    {item.summary || ""}
                  </p>
                  <small style={{ color: "#555" }}>
                    {new Date(item.published_at).toLocaleString()}
                  </small>
                </div>
              ))
            ) : (
              <p>No news found for {s}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
