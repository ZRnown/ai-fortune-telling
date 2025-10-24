"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Globe, User, Send, Sparkles } from "lucide-react"
import { LiuyaoChart } from "@/components/liuyao-chart"
import { isLoggedIn } from "@/lib/utils"
import { TopBar } from "@/components/topbar"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function LiuyaoPage() {
  const router = useRouter()
  const [language, setLanguage] = useState("zh")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "您好！我已经为您排好了六爻卦象。您可以询问我关于事业、财运、婚姻、健康等方面的问题，我会根据卦象为您详细解读。",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const aiMessage: Message = {
        role: "assistant",
        content: "根据您的卦象分析，这是一个很好的问题。让我为您详细解读...",
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <TopBar subtitle="六爻解读" />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-1/2 border-r border-border bg-card/30 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <LiuyaoChart locked />
          </div>
        </aside>

        <main className="w-1/2 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-8">
            <div className="max-w-full mx-auto space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg px-6 py-4 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium text-secondary">AI命理师</span>
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-lg px-6 py-4 bg-card border border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-sm text-muted-foreground">AI正在思考...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-border bg-card/50 backdrop-blur-sm p-6 flex-shrink-0">
            <div className="max-w-full mx-auto">
              <div className="flex gap-4 items-end">
                <Textarea
                  placeholder="询问关于卦象的问题..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-background resize-none min-h-[60px] max-h-[120px]"
                  disabled={isLoading}
                  rows={2}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="lg" className="px-8">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">按 Enter 发送，Shift + Enter 换行</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
