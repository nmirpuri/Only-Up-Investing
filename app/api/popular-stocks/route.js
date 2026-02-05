export async function GET() {
  return Response.json([
    {
      name: "Apple",
      symbol: "AAPL",
      price: 182.34,
      change: 2.1,
      views: 12400,
      domain: "apple.com",
    },
    {
      name: "Tesla",
      symbol: "TSLA",
      price: 238.9,
      change: -1.8,
      views: 9800,
      domain: "tesla.com",
    },
    {
      name: "Nvidia",
      symbol: "NVDA",
      price: 512.67,
      change: 3.6,
      views: 15300,
      domain: "nvidia.com",
    },
    {
      name: "Amazon",
      symbol: "AMZN",
      price: 168.22,
      change: 0.9,
      views: 8700,
      domain: "amazon.com",
    },
  ]);
}
