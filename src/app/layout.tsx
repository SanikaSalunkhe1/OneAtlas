import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "OneAtlas — AI Model Discovery & Intelligence Platform",
  description:
    "Discover, explore, compare and evaluate AI models from multiple AI labs and providers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF9F6] text-[#171717] antialiased flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-[#E7E2D9] py-6 text-center text-xs text-[#77736C]">
          OneAtlas &copy; 2026 AI Model Discovery & Intelligence Platform. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
