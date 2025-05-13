import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { OrganizationSchema } from "@/components/OrganizationSchema"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL("https://unilife.fi"),
  title: {
    default: "UNI LIFE - Student Events in Finland",
    template: "%s | UNI LIFE" // For page-specific titles
  },
  description: "Creating large-scale and high-value student events across Finland.",
  keywords: [
    "UNI LIFE",
    "Beer Pong Battle Royale",
    "Helsinki beer pong tournament",
    "biggest beer pong prize Finland",
    "Magic Island event",
    "UNI LIFE events",
    "student events Helsinki",
    "Finnish beer pong championship",
    "beer pong tapahtuma Suomi",
    "opiskelijatapahtuma Helsinki",
    "UNI LIFE newsletter",
    "beer pong tournament Finland 2025",
    "isoin beer pong palkinto Suomi",
    "beer pong kilpailu",
    "opiskelijabileet Suomi",
    "student party Finland",
    "tapahtumajärjestäjä Helsinki",
    "uni student events",
    "Helsinki nightlife events",
    "beer pong competition Helsinki"
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
        <OrganizationSchema />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
