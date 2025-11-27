import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { GoogleAdsense } from "@/components/google-adsense";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Studio - Build Prompt That Performs 10x Better",
  description: "Prompt Studio is the place to build, monitor, and improve your prompts to make sure they output 10x better.",
  icons: {
    icon: [
      // Le PNG en priorité pour Google et les navigateurs modernes
      { url: '/media/logo.png', type: 'image/png' },
      // Le fichier .ico en fallback pour les très vieux navigateurs
      { url: '/icon.ico' },
    ],
    // Pour les iPhones/iPads
    apple: [
      { url: '/media/logo.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAdsense pId="7048367176497618" />
        <meta name="google-adsense-account" content="ca-pub-7048367176497618" />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
