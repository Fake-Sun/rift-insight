import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Barlow, Space_Grotesk } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700", "800"]
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "700"]
});

export const metadata: Metadata = {
  title: "Rift Insight",
  description:
    "A responsive League of Legends stats dashboard built with Next.js, TypeScript, and Riot API integration.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
