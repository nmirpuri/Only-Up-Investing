import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `https://financialmodelingprep.com/api/v4/insider-trading?apikey=${process.env.FMP_API_KEY}`
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch insider trades" },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

