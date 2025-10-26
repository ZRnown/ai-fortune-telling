"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ReadingContent from "./reading-content"
import { LoadingScreen } from "./loading-screen"

function ReadingPageContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "professional"
  const isSimpleMode = mode === "simple"

  const [showLoading, setShowLoading] = useState(isSimpleMode)

  useEffect(() => {
    if (!isSimpleMode) {
      setShowLoading(false)
    }
  }, [isSimpleMode])

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />
  }

  return <ReadingContent />
}

export default function ReadingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">加载中...</div>
      }
    >
      <ReadingPageContent />
    </Suspense>
  )
}
