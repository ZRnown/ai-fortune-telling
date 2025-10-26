"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

const steps = [
  { id: 1, label: "解析生辰八字", duration: 1500 },
  { id: 2, label: "计算五行平衡", duration: 1500 },
  { id: 3, label: "分析十神关系", duration: 1500 },
  { id: 4, label: "推演大运流年", duration: 1500 },
  { id: 5, label: "生成命理报告", duration: 2000 },
]

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let totalDuration = 0
    const timers: NodeJS.Timeout[] = []

    steps.forEach((step, index) => {
      totalDuration += step.duration
      const timer = setTimeout(() => {
        setCurrentStep(index + 1)
      }, totalDuration - step.duration)
      timers.push(timer)
    })

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + 0.5
      })
    }, totalDuration / 200)

    // Complete after all steps
    const completeTimer = setTimeout(() => {
      onComplete()
    }, totalDuration)

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(progressTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-medium mb-2">正在为您排盘</h2>
          <p className="text-sm text-muted-foreground">AI正在深度分析您的命理信息</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">{Math.round(progress)}%</div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 transition-all duration-300 ${
                index < currentStep ? "opacity-100" : index === currentStep ? "opacity-100" : "opacity-30"
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  index < currentStep
                    ? "border-primary bg-primary"
                    : index === currentStep
                      ? "border-primary bg-primary animate-pulse"
                      : "border-muted-foreground/30"
                }`}
              >
                {index < currentStep && (
                  <svg
                    className="w-4 h-4 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/30 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-primary/30 animate-bounce [animation-delay:0.15s]" />
          <div className="w-2 h-2 rounded-full bg-primary/30 animate-bounce [animation-delay:0.3s]" />
        </div>
      </div>
    </div>
  )
}
