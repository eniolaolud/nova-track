import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BottomNav from "./components/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NovaTrack",
  description: "Track habits, to-dos, and progress in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div style={{ flex: 1, paddingBottom: 72 }}>{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
