"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles, X } from "lucide-react"
import { LiuyaoChart } from "@/components/liuyao-chart"
import { TopBar } from "@/components/topbar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function LiuyaoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "您好！我已经为您排好了六爻卦象。您可以询问我关于事业、财运、婚姻、健康等方面的问题，我会根据卦象为您详细解读。",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mobileChatOpen, setMobileChatOpen] = useState(false)
  const [drawerMounted, setDrawerMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mobileChatOpen) {
      setDrawerMounted(true)
    } else {
      const t = setTimeout(() => setDrawerMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [mobileChatOpen])

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
    const prompt = input
    setInput("")
    setIsLoading(true)

    try {
      // TODO: 实现六爻专用的 AI 接口
      const res = await fetch("/api/liuyao-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      const reply = data?.reply || "根据您的卦象分析，这是一个很好的问题。让我为您详细解读..."
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: e?.message || "请求失败，请稍后重试。" }])
    } finally {
      setIsLoading(false)
    }
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

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <aside className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-border bg-card/30 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <LiuyaoChart locked />
          </div>
        </aside>

        <main className="hidden md:flex md:w-1/2 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-8">
            <div className="max-w-full mx-auto space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border-2 border-border"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-secondary" />
                        <span className="text-sm font-medium text-secondary">AI命理师</span>
                      </div>
                    )}
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-6 py-4 bg-card border-2 border-border shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-bounce" />
                        <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-bounce [animation-delay:0.15s]" />
                        <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-bounce [animation-delay:0.3s]" />
                      </div>
                      <span className="text-sm text-muted-foreground">AI正在思考...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 桌面端输入框 */}
          <div className="border-t-2 border-border bg-card/50 backdrop-blur-sm p-6 flex-shrink-0">
            <div className="max-w-full mx-auto">
              <div className="flex gap-4 items-end">
                <Textarea
                  placeholder="询问关于卦象的问题..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-background resize-none min-h-[60px] max-h-[120px] text-base"
                  disabled={isLoading}
                  rows={2}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="lg" className="px-8 h-[60px]">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">按 Enter 发送，Shift + Enter 换行</p>
            </div>
          </div>
        </main>
      </div>

      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-card/95 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileChatOpen(true)}
            className="flex-1 text-left text-base text-muted-foreground bg-background border-2 border-border rounded-xl px-4 py-3.5 hover:border-primary/50 transition-colors"
          >
            询问关于卦象的问题...
          </button>
          <Button size="lg" onClick={() => setMobileChatOpen(true)} className="h-[52px] px-5">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="h-[76px] md:hidden" />

      {drawerMounted && (
        <div
          className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
            mobileChatOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileChatOpen(false)} />
          <div
            className={`absolute inset-x-0 bottom-0 h-[85vh] bg-card rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
              mobileChatOpen ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="py-3">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-muted" />
            </div>
            <div className="border-t-2 border-border px-4 py-4 flex items-center justify-between">
              <div className="text-base font-medium">AI 命理对话</div>
              <Button variant="ghost" size="sm" onClick={() => setMobileChatOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-secondary" />
                          <span className="text-xs font-medium text-secondary">AI命理师</span>
                        </div>
                      )}
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted border border-border">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.15s]" />
                          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                        <span className="text-xs text-muted-foreground">AI正在思考...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="border-t-2 border-border bg-card/95 backdrop-blur-sm px-4 py-4">
              <div className="flex gap-3 items-end">
                <Textarea
                  placeholder="请输入您的问题..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  className="flex-1 bg-background resize-none min-h-[48px] max-h-[120px] text-base"
                  disabled={isLoading}
                  rows={2}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="h-[48px] px-5">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center">下拉或点击空白处关闭</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
