'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TRADES = [
  {
    person: 'Jensen Huang',
    role: 'CEO',
    organization: 'NVIDIA',
    category: 'CEO',
    symbol: 'NVDA',
    action: 'BUY',
    amountUSD: 12400000,
    date: '2026-01-12',
    signal: 'High Conviction',
  },
  {
    person: 'Nancy Pelosi',
    role: 'Congress',
    organization: 'U.S. Government',
    category: 'Politician',
    symbol: 'AAPL',
    action: 'BUY',
    amountUSD: 500000,
    date: '2026-01-08',
    signal: 'Political Alpha',
  },
  {
    person: 'Tim Cook',
    role: 'CEO',
    organization: 'Apple',
    category: 'CEO',
    symbol: 'AAPL',
    action: 'SELL',
    amountUSD: 8000000,
    date: '2026-01-05',
    signal: 'Profit Taking',
  },
]

export default function TopTrades() {
  const [filter, setFilter] = useState('ALL')
  const router = useRouter()

  const filtered = TRADES.filter(
    t => filter === 'ALL' || t.category === filter
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-14">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Insider Top Trades
        </h1>
        <p className="text-zinc-400 mt-3 max-w-2xl">
          Track what CEOs and politicians are buying and selling — legally disclosed, high-signal trades.
        </p>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto flex gap-3 mb-8">
        {['ALL', 'CEO', 'Politician'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${filter === f
                ? 'bg-white text-black'
                : 'bg-white/10 hover:bg-white/20'}`}
          >
            {f === 'ALL' ? 'All Trades' : f}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t, i) => {
          const buy = t.action === 'BUY'

          return (
            <button
              key={i}
              onClick={() => router.push(`/stock/${t.symbol}`)}
              className={`rounded-2xl p-6 text-left border transition-all hover:scale-[1.03]
                ${buy
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'border-red-500/30 bg-red-500/10'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold">{t.person}</h3>
                  <p className="text-sm text-zinc-400">
                    {t.role} • {t.organization}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full
                  ${buy ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'}`}>
                  {t.action}
                </span>
              </div>

              <div className="text-3xl font-extrabold mb-2">
                {t.symbol}
              </div>

              <p className="text-sm text-zinc-300 mb-3">
                ${t.amountUSD.toLocaleString()} • {t.date}
              </p>

              <div className="text-xs text-zinc-400">
                🔥 {t.signal}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
