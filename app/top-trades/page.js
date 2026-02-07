'use client'

import { useRouter } from 'next/navigation'

const TOP_TRADES = [
  { symbol: 'AAPL', name: 'Apple', price: 189.12, change: +1.42, volume: '82M' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 624.55, change: +3.88, volume: '54M' },
  { symbol: 'TSLA', name: 'Tesla', price: 218.73, change: -2.14, volume: '91M' },
  { symbol: 'META', name: 'Meta', price: 471.02, change: +2.01, volume: '39M' },
]

export default function TopTradesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-14">
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          🔥 Top Trades Today
        </h1>
        <p className="text-zinc-400 mt-3 max-w-2xl">
          Most active stocks based on volume and momentum.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOP_TRADES.map((stock) => {
          const positive = stock.change >= 0

          return (
            <button
              key={stock.symbol}
              onClick={() => router.push(`/stock/${stock.symbol}`)}
              className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 text-left transition-all hover:scale-[1.03] hover:border-white/20"
            >
              <h2 className="text-2xl font-bold">{stock.symbol}</h2>
              <p className="text-sm text-zinc-400 mb-4">{stock.name}</p>

              <div className="text-3xl font-extrabold mb-2">
                ${stock.price.toFixed(2)}
              </div>

              <div className="flex justify-between text-sm">
                <span className={positive ? 'text-emerald-400' : 'text-red-400'}>
                  {positive ? '+' : ''}
                  {stock.change}%
                </span>
                <span className="text-zinc-400">Vol {stock.volume}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
