import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saispacerealty.com"),
  title: {
    default: "Sai Space Realty | Find Your Space. Build Your Future.",
    template: "%s | Sai Space Realty",
  },
  description:
    "Sai Space Realty helps you find premium residential, commercial and rental properties across India. Browse verified listings, connect with our agents, and build your future in the right space.",
  openGraph: {
    title: "Sai Space Realty",
    description: "Find Your Space. Build Your Future.",
    siteName: "Sai Space Realty",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full bg-ivory-50 text-navy-900">{children}</body>
    </html>
  );
}
