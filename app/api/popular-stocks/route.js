import { NextResponse } from "next/server";

export async function GET() {
  const stocks = [
    {
      name: "Apple",
      ticker: "AAPL",
      price: 182.34,
      change: 2.1,
      watchers: 12400,
    },
    {
      name: "Tesla",
      ticker: "TSLA",
      price: 238.9,
      change: -1.8,
      watchers: 9800,
    },
    {
      name: "Nvidia",
      ticker: "NVDA",
      price: 512.67,
      change: 3.6,
      watchers: 15300,
    },
    {
      name: "Amazon",
      ticker: "AMZN",
      price: 168.22,
      change: 0.9,
      watchers: 8700,
    },
  ];

  return NextResponse.json(stocks);
}
