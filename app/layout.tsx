import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/* body face */
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

/* display face (was base64-embedded in the original index.html) */
const vela = localFont({
  src: [
    { path: "./fonts/vela-300.woff", weight: "300", style: "normal" },
    { path: "./fonts/vela-400.woff", weight: "400", style: "normal" },
    { path: "./fonts/vela-600.woff", weight: "600", style: "normal" },
  ],
  variable: "--font-vela",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VelaHome — Real-estate website",
  description: "VelaHome designs and sells villas and cottages around Hyderabad, from ₹1.35 Cr. Book a visit to the sales gallery or message us on WhatsApp.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${vela.variable}`} suppressHydrationWarning>
      <head>
        {/* scroll reveals only hide content once we know scripts run */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preload" as="image" href="/back.jpg" />
        <link rel="preload" as="image" href="/house.webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
