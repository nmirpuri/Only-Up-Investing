export async function GET() {
  const ticker = "AAPL"; // optional: make dynamic later
  const res = await fetch(`https://api.api-ninjas.com/v1/insidertransactions?ticker=${ticker}`, {
    headers: {
      "X-Api-Key": process.env.API_NINJAS_KEY
    }
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch" }), { status: 500 });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
