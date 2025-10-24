import { Suspense } from "react"
import ReadingContent from "./reading-content"

export default function ReadingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">加载中...</div>}>
      <ReadingContent />
    </Suspense>
  )
}
