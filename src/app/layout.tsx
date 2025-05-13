import type React from "react"
import Script from 'next/script';
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { OrganizationSchema } from "@/components/OrganizationSchema"
import { NavbarProvider } from "@/contexts/NavbarContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL("https://unilife.fi"),
  title: {
    default: "UNI LIFE - Student Events in Finland",
    template: "%s | UNI LIFE"
  },
  description: "Creating large-scale and high-value student events across Finland.",
  keywords: [
    "UNI LIFE",
    "student events finland",
    "student events helsinki",
    "university events finland",
    "student life finland",
    "events for students finland",
    "student parties helsinki",
    "student culture helsinki",
    "unilife events",
    "student networking events finland",
    "student social events uusimaa",
    "opiskelijabileet helsinki",
    "suomen opiskelijatapahtumat ",
    "opiskelijatapahtumat helsinki",
    "international students events helsinki",
  ],
  openGraph: {
    type: 'website',
    locale: 'en_FI',
    url: 'https://unilife.fi/',
    siteName: 'UNI LIFE',
    images: [
      {
        url: 'https://unilife.fi/unilife_cover.jpg', // Create a dedicated OG image
        width: 1200,
        height: 630,
        alt: 'UNI LIFE - Student Events in Finland',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://unilife.fi/og-unilife_cover.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* AHREFS analytics -script */}
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="c4edFtLyzOY0an+l7w/I4Q" async></Script>
        
        {/* Google Analytics – gtag.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VH8F3Z11MT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VH8F3Z11MT');
          `}
        </Script>

        <OrganizationSchema />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NavbarProvider>
            {children}
          </NavbarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
