import { Newsreader, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pivotech — Ambitious technologists. Impactful products.",
  description:
    "Pivotech is an ecosystem that brings ambitious technologists together to build impactful and commercially viable products.",
  metadataBase: new URL("https://pivotech.io"),
  openGraph: {
    title: "Ambitious technologists. Impactful products.",
    description:
      "Pivotech brings ambitious technologists together to build impactful and commercially viable products.",
    url: "https://pivotech.io",
    siteName: "Pivotech",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambitious technologists. Impactful products.",
    description:
      "Pivotech brings ambitious technologists together to build impactful and commercially viable products.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${hankenGrotesk.variable}`}
    >
      <body className="font-sans bg-beige text-navy antialiased">
        {children}
      </body>
    </html>
  );
}
