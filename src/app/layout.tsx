import type React from "react"
import Script from 'next/script';
import "@/app/globals.css"
import { Outfit  } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { OrganizationSchema } from "@/components/OrganizationSchema"
import { NavbarProvider } from "@/contexts/NavbarContext";

const outfit = Outfit({
  weight: ["400", "500", "700"], // font-normal, -medium, -bold
  subsets: ["latin"],
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL("https://www.unilife.fi"),
  title: {
    default: "UNI LIFE - Student Events in Finland",
    template: "%s | UNI LIFE"
  },
  description: "No more boring parties. Time to make the most out of uni.",
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
    url: 'https://www.unilife.fi/',
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
    images: ['https://www.unilife.fi/og-unilife_cover.jpg'],
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
      <body className={outfit.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NavbarProvider>
            {children}
          </NavbarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
