import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "whatiuse Next.js quickstart",
  description: "A verified whatiuse source-registry install.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
