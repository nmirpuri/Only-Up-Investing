export default function NewsPage() {
  return (
    <main style={{ padding: 40 }}>
    <nav style={{ display: "flex", gap: 20, marginBottom: 30 }}>
  <Link href="/page" style={{ textDecoration: "none", color: "#2596be", fontWeight: 600 }}>
    My Portfolio
  </Link>

  <Link href="/news" style={{ textDecoration: "none", color: "#2596be", fontWeight: 600 }}>
    My News
  </Link>

  <Link href="/signin" style={{ textDecoration: "none", color: "#2596be", fontWeight: 600 }}>
    Sign In
  </Link>
</nav>
      <h1>My News</h1>
      <p>Stock news will live here.</p>
    </main>
  );
}
