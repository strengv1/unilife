import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL("https://unilife.fi"),
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
  title: "UNI LIFE - Student Events in Finland",
  description: "Creating large-scale and high-value student events across Finland.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
