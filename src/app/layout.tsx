import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Pactum AI | AI-Powered Intelligence",
  description: "Global Markets, Decoded by AI in Real-Time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen bg-[#131315] text-[#e5e1e4] overflow-x-hidden selection:bg-[#d97a53] selection:text-white">
        {children}
      </body>
    </html>
  );
}
