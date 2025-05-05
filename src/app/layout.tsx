import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";
import { Footer } from '@/components/shared/Footer';
import { auth } from '@/lib/auth';
import { Navbar } from '@/components/shared/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrackIt - Budget Tracking Made Simple",
  description: "Track your expenses and manage your budget with ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <div className="flex-1 flex flex-col">
            {session && <Navbar />}
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
