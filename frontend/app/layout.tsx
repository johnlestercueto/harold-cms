import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MaintenanceScreen } from "@/components/layout/MaintenanceScreen";
import { getSiteSettings } from "@/lib/payload/houses";
import { isPayloadAvailable } from "@/lib/payload/health";
import { siteConfig } from "@/config/site";
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
  title: siteConfig.name,
  description: siteConfig.tagline,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const payloadConnected = await isPayloadAvailable();

  if (!payloadConnected) {
    return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full bg-slate-950 text-slate-800">
          <MaintenanceScreen />
        </body>
      </html>
    );
  }

  const siteSettings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full text-slate-800">
        <div className="min-h-screen">
          <Header siteSettings={siteSettings} />
          <main>{children}</main>
          <Footer siteSettings={siteSettings} />
        </div>
      </body>
    </html>
  );
}
