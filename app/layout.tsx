import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Tambahkan import ini
import { TooltipProvider } from "@/components/ui/tooltip";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LokerIn - Temukan Karir Impianmu",
  description: "Platform rekrutmen terpercaya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} antialiased font-sans`}
      >
        {/* 2. Bungkus children dengan TooltipProvider */}
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}