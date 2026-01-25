"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: 24,
        padding: "16px 0",
        marginBottom: 30,
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: "none",
          fontWeight: 600,
          color: "#2596be",
        }}
      >
        My Portfolio
      </Link>

      <Link
        href="/news"
        style={{
          textDecoration: "none",
          fontWeight: 600,
          color: "#2596be",
        }}
      >
        My News
      </Link>
      <Link
  href="/top-trades"
  style={{
    textDecoration: "none",
    fontWeight: 600,
    color: "#2596be",
  }}
>
  Top Trades
</Link>

      <Link
        href="/signin"
        style={{
          textDecoration: "none",
          fontWeight: 600,
          color: "#2596be",
        }}
      >
        Sign In
      </Link>
    </nav>
  );
}
