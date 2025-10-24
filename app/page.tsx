"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/topbar"

import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"

export default function Home() {
  const router = useRouter()
  const [language, setLanguage] = useState("zh")

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      {/* Showcase */}
      <main>
        <Hero />
        <Services />
        <Features />
        <Testimonials />
        <Footer />
      </main>
    </div>
  )
}
