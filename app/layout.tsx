import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "AI CTO Dashboard",
  description: "Turn SaaS ideas into controlled technical execution systems."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
