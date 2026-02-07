"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [trades, setTrades] = useState([]);
  const [tradeType, setTradeType] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insider-trades")
      .then(res => res.json())
      .then(data => {
        setTrades(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredTrades = trades.filter(
    t => tradeType === "ALL" || t.type === tradeType
  );

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Top Insider Trades</h1>
      <p style={subtitleStyle}>
        Real insider buy & sell activity from major U.S. companies
      </p>

      {/* Filters */}
      <div style={filterRow}>
        {["ALL", "BUY", "SELL"].map(type => (
          <button
            key={type}
            onClick={() => setTradeType(type)}
            style={
              tradeType === type
                ? type === "BUY"
                  ? activeBuy
                  : type === "SELL"
                  ? activeSell
                  : activeFilter
                : filterButton
            }
          >
            {type}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={tableWrapper}>
        {loading && <p style={emptyState}>Loading insider trades…</p>}

        {!loading && (
          <table style={tableStyle}>
            <thead>
              <tr style={headerRow}>
                <th>Insider</th>
                <th>Ticker</th>
                <th>Type</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Date</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((t, i) => (
                <tr key={i} style={rowStyle}>
                  <td>{t.name}</td>
                  <td style={{ fontWeight: 600 }}>{t.symbol}</td>
                  <td
                    style={{
                      fontWeight: 600,
                      color: t.type === "BUY" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {t.type}
                  </td>
                  <td>{t.shares.toLocaleString()}</td>
                  <td>${t.price.toFixed(2)}</td>
                  <td>{t.date}</td>
                  <td style={{ fontWeight: 600 }}>
                    ${(t.shares * t.price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredTrades.length === 0 && (
          <p style={emptyState}>No trades found.</p>
        )}
      </div>
    </div>
  );
}
