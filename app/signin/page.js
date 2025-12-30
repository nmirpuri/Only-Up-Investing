export default function SignInPage() {
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
      <h1>Sign In</h1>
      <p>This is the sign-in page.</p>
    </main>
  );
}
