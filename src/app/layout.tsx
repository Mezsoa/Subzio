import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import AnalyticsListener from "@/components/AnalyticsListener";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ErrorProvider } from "@/contexts/ErrorContext";
import AppProviders from "@/components/AppProviders";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config as fontawesomeConfig } from "@fortawesome/fontawesome-svg-core";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

fontawesomeConfig.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KillSub – Find subscriptions with AI. Cancel with guidance.",
  description:
    "Connect via Plaid/BankID to scan for recurring charges and get guided cancellation links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <ErrorProvider>
            <AppProviders>
              <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-P6J457HR70"
                strategy="afterInteractive"
              />
              <Script id="gtag-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-P6J457HR70');
                `}
              </Script>
              {children}
              <Analytics />
              <Suspense fallback={null}>
                <AnalyticsListener />
                <SpeedInsights />
              </Suspense>
            </AppProviders>
          </ErrorProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
