"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, History, Globe, User, Send, Sparkles, Menu } from "lucide-react"
import { BaziChart } from "@/components/bazi-chart"
import { buildBaziInstruction } from "@/lib/bazi-instruction"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { isLoggedIn } from "@/lib/utils"
import { TopBar } from "@/components/topbar"
import { computeBazi } from "@/lib/bazi"

interface Message {
  role: "user" | "assistant"
  content: string
}

type ReportType = "basic" | "personality" | "fortune" | "deep"

export default function ReadingContent() {
  const router = useRouter()
  const search = useSearchParams()
  const q = (k: string) => search.get(k) ?? ""
  const name = q("name")
  const gender = q("gender")
  const displayGender = (gender === '女' || gender === 'female') ? '女' : (gender === '男' || gender === 'male') ? '男' : '男'
  const y = parseInt(q("y") || "")
  const m = parseInt(q("m") || "")
  const d = parseInt(q("d") || "")
  const h = parseInt(q("h") || "")
  const mi = parseInt(q("mi") || "")
  const hasAll = [y, m, d, h, mi].every((n) => Number.isFinite(n))
  const baziResult = hasAll
    ? computeBazi({ year: y, month: m, day: d, hour: h, minute: mi })
    : computeBazi({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
      })
  const [language, setLanguage] = useState("zh")
  const [reportType, setReportType] = useState<ReportType>("basic")
  const tabOrder: ReportType[] = ["basic", "fortune", "personality", "deep"]
  const nextTab = (dir: 1 | -1) => {
    const idx = tabOrder.indexOf(reportType)
    const next = Math.min(Math.max(idx + dir, 0), tabOrder.length - 1)
    setReportType(tabOrder[next])
  }
  const touchRef = useRef<{ x: number; y: number } | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "您好！我已经为您排好了八字命盘。您可以询问我关于事业、财运、婚姻、健康等方面的问题，我会根据您的八字为您详细解读。",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileChatOpen, setMobileChatOpen] = useState(false)
  const [drawerMounted, setDrawerMounted] = useState(false)
  useEffect(() => {
    if (mobileChatOpen) {
      setDrawerMounted(true)
    } else {
      const t = setTimeout(() => setDrawerMounted(false), 200)
      return () => clearTimeout(t)
    }
  }, [mobileChatOpen])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [instruction, setInstruction] = useState<string>("")
  const [personalityMd, setPersonalityMd] = useState<string>("")
  const [personalityLoading, setPersonalityLoading] = useState(false)
  const [personalityError, setPersonalityError] = useState<string | null>(null)
  const [dayunImageError, setDayunImageError] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 生成并缓存命理指令（包含当前时间信息）
  useEffect(() => {
    try {
      const { instruction } = buildBaziInstruction(baziResult, { gender })
      setInstruction(instruction)
      // 指令变化时重置个性报告缓存
      setPersonalityMd("")
      setPersonalityError(null)
    } catch {}
  }, [baziResult, gender])

  // 当切到“个性报告”时，请求 AI 生成该段内容
  useEffect(() => {
    const needFetch = reportType === "personality"
    if (!needFetch || !instruction) return
    let aborted = false
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)
    const run = async () => {
      try {
        setPersonalityLoading(true)
        setPersonalityError(null)
        const prompt = `只输出"个性报告"相关内容（性格简述、性格优点、性格缺点、做事风格/工作表现、金钱观、爱情观、给外人的感受、潜在MBTI性格）。
要求：
- 严格使用 Markdown 小标题组织内容；
- 结合上述<用户八字报告>深入分析；
- 表述自然、有逻辑；
- 每个小节尽量详尽（建议每节≥200字）；
- 不要重复打印完整提示词；
- 只输出报告正文，不要寒暄。`
        const res = await fetch("/api/fortune-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instruction, prompt }),
          signal: controller.signal,
        })
        const data = await res.json()
        console.log("[personality] HTTP", res.status, data)
        if (!aborted) {
          if (res.ok && data?.reply) setPersonalityMd(data.reply)
          else setPersonalityError(data?.error || `AI 生成失败（HTTP ${res.status}）`)
        }
      } catch (e: any) {
        if (!aborted) setPersonalityError(e?.name === 'AbortError' ? "请求超时，请重试" : (e?.message || "请求失败"))
      } finally {
        if (!aborted) setPersonalityLoading(false)
        clearTimeout(timeoutId)
      }
    }
    // 避免重复请求：若已有内容则不再请求
    if (!personalityMd) run()
    return () => {
      aborted = true
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [reportType, instruction])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    const prompt = input
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/fortune-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction, prompt }),
      })
      const data = await res.json()
      console.log("[chat] HTTP", res.status, data)
      const reply = data?.reply || data?.error || "抱歉，AI暂时无法回答。"
      console.log("[chat] reply", reply)
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: e?.message || "请求失败，请稍后重试。" },
      ])
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

  const renderReportContent = () => {
    switch (reportType) {
      case "personality":
        return (
          <div className="p-4 md:p-6 space-y-4 text-sm leading-relaxed">
            {personalityLoading && (
              <div className="text-muted-foreground">AI 正在生成个性报告...</div>
            )}
            {personalityError && (
              <div className="space-y-2">
                <div className="text-destructive">{personalityError}</div>
                <Button size="sm" variant="outline" onClick={() => { setPersonalityMd(""); setPersonalityError(null); setReportType("personality") }}>重试生成</Button>
              </div>
            )}
            {!personalityLoading && !personalityError && personalityMd && (
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{personalityMd}</ReactMarkdown>
              </div>
            )}
          </div>
        )
      case "fortune":
        return (
          <div className="p-2 md:p-3">
            <BaziChart
              result={baziResult}
              name={name}
              gender={gender}
              onSendInstruction={(ins) => setInstruction(ins)}
              compact
              birthInfo={hasAll ? { year: y, month: m, day: d, hour: h, minute: mi, gender: gender as 'male' | 'female' | '男' | '女' } : undefined}
            />
          </div>
        )
      case "deep":
        return (
          <div className="p-4 md:p-6 space-y-4 text-sm">
            <h3 className="text-lg font-bold text-secondary">深度报告</h3>
            <p className="text-muted-foreground">深度报告内容将在此显示...</p>
          </div>
        )
      default:
        return (
          <BaziChart
            result={baziResult}
            name={name}
            gender={gender}
            onSendInstruction={(ins) => setInstruction(ins)}
            birthInfo={hasAll ? { year: y, month: m, day: d, hour: h, minute: mi, gender: gender as 'male' | 'female' | '男' | '女' } : undefined}
          />
        )
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <TopBar subtitle="八字命理解读" />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left Panel */}
        <aside className="w-full md:w-[35%] border-b md:border-b-0 md:border-r border-border bg-card/30 flex flex-col overflow-hidden min-h-0">
          <div className="border-b border-border p-3 md:p-4">
            <div className="grid grid-cols-4 md:flex gap-2 md:gap-3 overflow-x-auto no-scrollbar md:overflow-visible">
              <Button
                variant={reportType === "basic" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("basic")}
                className="text-sm md:text-base"
              >
                基本信息
              </Button>
              <Button
                variant={reportType === "fortune" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("fortune")}
                className="text-sm md:text-base"
              >
                专业细盘
              </Button>
              <Button
                variant={reportType === "personality" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("personality")}
                className="text-sm md:text-base"
              >
                个性报告
              </Button>
              <Button
                variant={reportType === "deep" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("deep")}
                className="text-sm md:text-base"
              >
                深度报告
              </Button>
            </div>
          </div>
          <div
            className="flex-1 overflow-y-auto hide-scrollbar text-base md:text-lg leading-relaxed min-h-0"
            onTouchStart={(e) => {
              const t = e.touches[0]
              touchRef.current = { x: t.clientX, y: t.clientY }
            }}
            onTouchEnd={(e) => {
              if (!touchRef.current) return
              const t = e.changedTouches[0]
              const dx = t.clientX - touchRef.current.x
              const dy = t.clientY - touchRef.current.y
              touchRef.current = null
              if (Math.abs(dx) > 50 && Math.abs(dy) < 40) {
                if (dx < 0) nextTab(1)
                else nextTab(-1)
              }
            }}
          >
            {renderReportContent()}
          </div>
        </aside>

        {/* Right Panel */}
        <main className="w-full md:w-[65%] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto hide-scrollbar px-4 md:px-6 py-6 md:py-8 hidden md:block">
            <div className="max-w-full mx-auto space-y-4 md:space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[90%] md:max-w-[85%] rounded-lg px-4 md:px-6 py-3 md:py-4 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium text-secondary">AI命理师</span>
                      </div>
                    )}
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] md:max-w-[85%] rounded-lg px-4 md:px-6 py-3 md:py-4 bg-card border border-border">
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

          {/* Desktop composer */}
          <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 flex-shrink-0 hidden md:block">
            <div className="max-w-full mx-auto">
              <div className="flex gap-2 md:gap-4 items-end">
                <Textarea
                  ref={textareaRef}
                  placeholder="询问关于您命理的问题..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-background resize-none min-h-[50px] md:min-h-[60px] max-h-[120px] text-sm md:text-base"
                  disabled={isLoading}
                  rows={2}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="lg" className="px-8 h-[60px]">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">按 Enter 发送，Shift + Enter 换行</p>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile input bar */}
      <div className="fixed inset-x-0 bottom-0 md:hidden z-40 border-t border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="px-3 py-2 flex items-center gap-2">
          <button
            onClick={() => setMobileChatOpen(true)}
            className="flex-1 text-left text-sm text-muted-foreground bg-background border border-border rounded-lg px-3 py-3"
          >
            询问关于您命理的问题...
          </button>
          <Button size="sm" onClick={() => setMobileChatOpen(true)} className="h-[40px] px-3">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="h-[64px] md:hidden" />

      {drawerMounted && (
        <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${mobileChatOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileChatOpen(false)}
          />
          <div
            className={`absolute inset-x-0 bottom-0 h-[90vh] bg-card rounded-t-2xl shadow-xl flex flex-col transition-transform duration-200 ${mobileChatOpen ? 'translate-y-0' : 'translate-y-full'}`}
          >
            <div className="py-2">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-muted" />
            </div>
            <div className="border-t border-border px-4 py-3 flex items-center justify-between">
              <div className="text-sm font-medium">AI 命理对话</div>
              <Button variant="ghost" size="sm" onClick={() => setMobileChatOpen(false)}>关闭</Button>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[90%] rounded-lg px-3 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                      }`}
                    >
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
                    <div className="max-w-[90%] rounded-lg px-3 py-2 bg-card border border-border">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="text-xs text-muted-foreground">AI正在思考...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-border bg-card/80 backdrop-blur px-3 py-3">
              <div className="flex gap-2 items-end">
                <Textarea
                  placeholder="请输入您的问题..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
                  }}
                  className="flex-1 bg-background resize-none min-h-[44px] max-h-[120px] text-sm"
                  disabled={isLoading}
                  rows={2}
                />
                <Button onClick={async () => { await handleSend(); }} disabled={isLoading || !input.trim()} className="h-[44px] px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground text-center">下拉或点击空白处关闭</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
