'use client'

import { useRouter } from 'next/navigation'
import { TrendingUp, Flame, ArrowUpRight } from 'lucide-react'

const TOP_TRADES = [
  {
    symbol: 'AAPL',
    name: 'Apple',
    price: 189.12,
    change: +1.42,
    volume: '82M',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    price: 624.55,
    change: +3.88,
    volume: '54M',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla',
    price: 218.73,
    change: -2.14,
    volume: '91M',
  },
  {
    symbol: 'META',
    name: 'Meta',
    price: 471.02,
    change: +2.01,
    volume: '39M',
  },
]

export default function TopTradesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-14">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
          <Flame className="text-orange-500" />
          Top Trades Today
        </h1>
        <p className="text-zinc-400 mt-3 max-w-2xl">
          Most active stocks based on volume, momentum, and trader interest.
          Updated in near real-time.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOP_TRADES.map((stock) => {
          const positive = stock.change >= 0

          return (
            <button
              key={stock.symbol}
              onClick={() => router.push(`/stock/${stock.symbol}`)}
              className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 text-left backdrop-blur-xl transition-all hover:scale-[1.03] hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]"
            >
              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{stock.symbol}</h2>
                  <p className="text-sm text-zinc-400">{stock.name}</p>
                </div>
                <ArrowUpRight className="text-zinc-500 group-hover:text-white transition" />
              </div>

              {/* Price */}
              <div className="text-3xl font-extrabold mb-2">
                ${stock.price.toFixed(2)}
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`font-semibold ${
                    positive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {positive ? '+' : ''}
                  {stock.change}%
                </span>
                <span className="text-zinc-400 flex items-center gap-1">
                  <TrendingUp size={16} />
                  Vol {stock.volume}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
