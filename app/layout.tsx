import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif_SC, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "万象 - AI智能算命",
  description: "融合千年易学智慧与现代AI科技，为您揭示命运玄机",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSerifSC.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
