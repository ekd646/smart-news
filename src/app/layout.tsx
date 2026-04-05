import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Republia | Enterprise Law Suite",
  description: "Total Corporate Legal Intelligence, Decoded by AI.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%237f2227'/><text x='50' y='76' font-family='serif' font-size='72' font-weight='900' font-style='italic' fill='%23f2f2f2' text-anchor='middle'>R</text></svg>"
  }
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
      <body className="min-h-screen bg-[#131315] text-[#e5e1e4] overflow-x-hidden selection:bg-[#8B1A2B] selection:text-white">
        {children}
      </body>
    </html>
  );
}
