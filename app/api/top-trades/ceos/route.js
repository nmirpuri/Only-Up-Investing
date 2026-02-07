import { NextResponse } from 'next/server'

const FINNHUB_KEY = process.env.FINNHUB_API_KEY

export async function GET() {
  const symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL']

  const results = []

  for (const symbol of symbols) {
    const res = await fetch(
      `https://finnhub.io/api/v1/stock/insider-transactions?symbol=${symbol}&token=${FINNHUB_KEY}`
    )
    const data = await res.json()

    data.data?.slice(0, 3).forEach(t => {
      results.push({
        person: t.name,
        role: 'Executive',
        organization: symbol,
        category: 'CEO',
        symbol,
        action: t.transactionType === 'P' ? 'BUY' : 'SELL',
        amountUSD: t.transactionPrice * t.change,
        date: t.transactionDate,
        signal: 'SEC Insider Filing',
      })
    })
  }

  return NextResponse.json(results)
}
