import Navbar from "./components/Navbar";

export const metadata = {
  title: "Only Up",
  description: "Professional portfolio tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#f8fafc",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
