import localFont from "next/font/local";
import "./globals.css";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

async function SanityPreviewConnection() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) return null;
  return (await draftMode()).isEnabled ? <VisualEditing /> : null;
}

const newsreader = localFont({
  src: [
    { path: "./fonts/Newsreader[opsz,wght].ttf", weight: "300 600", style: "normal" },
    { path: "./fonts/Newsreader-Italic[opsz,wght].ttf", weight: "300 600", style: "italic" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

const hankenGrotesk = localFont({
  src: "./fonts/HankenGrotesk[wght].ttf",
  weight: "400 700",
  variable: "--font-hanken-grotesk",
  display: "swap",
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
        <SanityPreviewConnection />
      </body>
    </html>
  );
}
