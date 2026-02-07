'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TopTrades() {
  const [filter, setFilter] = useState('ALL')
  const [trades, setTrades] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const [ceos, pols] = await Promise.all([
        fetch('/api/top-trades/ceos').then(r => r.json()),
        fetch('/api/top-trades/politicians').then(r => r.json()),
      ])
      setTrades([...ceos, ...pols])
    }
    load()
  }, [])

  const filtered =
    filter === 'ALL' ? trades : trades.filter(t => t.category === filter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-14">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-5xl font-extrabold">Top Insider Trades</h1>
        <p className="text-zinc-400 mt-3">
          Real trades from CEOs and U.S. politicians — disclosed and tracked.
        </p>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto flex gap-4 mb-10">
        <Filter label="All" active={filter === 'ALL'} onClick={() => setFilter('ALL')} />
        <Filter label="CEO" color="blue" active={filter === 'CEO'} onClick={() => setFilter('CEO')} />
        <Filter label="Politician" color="orange" active={filter === 'Politician'} onClick={() => setFilter('Politician')} />
      </div>

      {/* CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((t, i) => {
          const buy = t.action === 'BUY'
          return (
            <button
              key={i}
              onClick={() => router.push(`/stock/${t.symbol}`)}
              className={`rounded-3xl p-6 border backdrop-blur-xl transition-all
                hover:scale-[1.04] hover:shadow-2xl
                ${buy ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-red-500/40 bg-red-500/10'}`}
            >
              <h3 className="text-xl font-bold">{t.person}</h3>
              <p className="text-sm text-zinc-400 mb-3">{t.role}</p>

              <div className="text-4xl font-extrabold mb-2">{t.symbol}</div>

              <div className="flex justify-between text-sm mb-3">
                <span className={buy ? 'text-emerald-400' : 'text-red-400'}>
                  {t.action}
                </span>
                <span>${Number(t.amountUSD || 0).toLocaleString()}</span>
              </div>

              <p className="text-xs text-zinc-400">{t.date}</p>
              <p className="text-xs mt-2">🔥 {t.signal}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Filter({ label, active, onClick, color }) {
  const colors = {
    blue: 'bg-blue-500 shadow-blue-500/40',
    orange: 'bg-orange-500 shadow-orange-500/40',
  }

  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full font-semibold transition-all
        ${active
          ? `${colors[color]} text-black shadow-lg`
          : 'bg-white/10 hover:bg-white/20 text-white'}`}
    >
      {label}
    </button>
  )
}
