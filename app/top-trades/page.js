"use client";
import { useEffect, useState } from "react";

export default function TopTrades() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    fetch("/api/insiders")
      .then(res => res.json())
      .then(data => setTrades(data))
      .catch(err => console.error(err));
  }, []);

  if (!trades.length) return <p>No trades available at the moment.</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Top Trades</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Ticker</th>
            <th>Type</th>
            <th>Shares</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i}>
              <td>{t.name}</td>
              <td>{t.relationship}</td>
              <td>{t.ticker}</td>
              <td>{t.transaction_type}</td>
              <td>{t.shares_traded}</td>
              <td>{t.price}</td>
              <td>{t.transaction_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
