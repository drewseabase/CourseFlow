// app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
          <h1>CourseFlow</h1>
        </header>

        <main style={{ padding: "1rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

