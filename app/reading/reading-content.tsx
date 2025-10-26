"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, Sparkles, X } from "lucide-react"
import { BaziChart } from "@/components/bazi-chart"
import { buildBaziInstruction } from "@/lib/bazi-instruction"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
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
  const mode = q("mode") || "professional"
  const isSimpleMode = mode === "simple"
  const displayGender =
    gender === "女" || gender === "female" ? "女" : gender === "男" || gender === "male" ? "男" : "男"
  const y = Number.parseInt(q("y") || "")
  const m = Number.parseInt(q("m") || "")
  const d = Number.parseInt(q("d") || "")
  const h = Number.parseInt(q("h") || "")
  const mi = Number.parseInt(q("mi") || "")
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

  const [personalityMd, setPersonalityMd] = useState<string>(`
### 性格简述
您的八字显示出一个内敛而富有智慧的性格特质。天干透出的五行组合表明您思维敏捷，善于分析问题，但有时会过于谨慎。

### 性格优点
- **深思熟虑**：做事前会仔细权衡利弊，不轻易冒险
- **责任心强**：对承诺的事情会全力以赴，值得信赖
- **学习能力强**：对新知识有强烈的好奇心和快速的吸收能力

### 性格缺点
- **过于谨慎**：有时会因为过度思考而错失良机
- **情绪内敛**：不善于表达内心感受，容易被误解
- **完美主义**：对自己和他人要求较高，可能造成压力

### 做事风格
您倾向于采用系统化的方法处理问题，注重细节和逻辑。在工作中表现出色，但需要注意平衡工作与生活。
  `)

  const [careerMd, setCareerMd] = useState<string>(`
### 职业发展方向
根据您的八字分析，适合从事需要深度思考和专业技能的工作。技术、研究、教育等领域都是不错的选择。

### 财运机遇
财运方面呈现稳中有升的趋势。建议通过提升专业能力来增加收入，避免投机性投资。

### 适合的行业
- 科技行业：软件开发、数据分析
- 教育培训：专业讲师、咨询顾问
- 金融服务：风险管理、财务规划

### 事业建议
保持学习的态度，不断提升专业技能。建立良好的人际网络，这将为您的事业发展带来更多机会。
  `)

  const [relationshipMd, setRelationshipMd] = useState<string>(`
### 爱情观
您对感情认真负责，不喜欢玩弄感情。一旦确定关系，会全心全意投入，期待长久稳定的关系。

### 婚姻走向
婚姻运势整体良好，但需要注意沟通。建议多表达内心感受，避免因误解产生隔阂。

### 感情建议
- 学会主动表达爱意和关心
- 给予伴侣足够的个人空间
- 共同规划未来，建立共同目标

### 配偶特征
您的理想伴侣可能是一个温和、善解人意的人，能够理解您的内敛性格，并给予支持和鼓励。
  `)

  const [healthMd, setHealthMd] = useState<string>(`
### 健康状况
整体健康状况良好，但需要注意因工作压力导致的身心疲劳。

### 易患疾病
- 消化系统：注意饮食规律，避免暴饮暴食
- 神经系统：容易因压力导致失眠、焦虑
- 颈椎腰椎：长时间工作需要注意姿势

### 养生建议
- 保持规律的作息时间
- 适度运动，如散步、瑜伽、太极
- 学会放松，培养兴趣爱好
- 定期体检，预防为主

### 注意事项
避免过度劳累，学会说"不"。保持积极乐观的心态，对健康大有裨益。
  `)

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
      const t = setTimeout(() => setDrawerMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [mobileChatOpen])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [instruction, setInstruction] = useState<string>("")
  const [personalityLoading, setPersonalityLoading] = useState(false)
  const [personalityError, setPersonalityError] = useState<string | null>(null)
  const [dayunImageError, setDayunImageError] = useState(false)
  const [simpleLoading, setSimpleLoading] = useState(false)
  const [simpleError, setSimpleError] = useState<string | null>(null)

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

  // 普通模式：自动生成四个维度的分析
  useEffect(() => {
    if (!isSimpleMode || !instruction) return
    if (personalityMd && careerMd && relationshipMd && healthMd) return

    let aborted = false
    const controller = new AbortController()

    const fetchAnalysis = async (dimension: string, setter: (md: string) => void) => {
      try {
        const prompts: Record<string, string> = {
          personality:
            '只输出"性格内涵"相关内容（性格简述、性格优点、性格缺点、做事风格、金钱观、爱情观、给外人的感受）。要求：严格使用 Markdown 小标题组织内容；结合八字深入分析；表述自然、有逻辑；每个小节尽量详尽（建议每节≥150字）；只输出报告正文，不要寒暄。',
          career:
            '只输出"事业财运"相关内容（职业发展方向、财富机遇、适合的行业、事业建议）。要求：严格使用 Markdown 小标题组织内容；结合八字深入分析；表述自然、有逻辑；每个小节尽量详尽（建议每节≥150字）；只输出报告正文，不要寒暄。',
          relationship:
            '只输出"感情婚姻"相关内容（爱情观、婚姻走向、感情建议、配偶特征）。要求：严格使用 Markdown 小标题组织内容；结合八字深入分析；表述自然、有逻辑；每个小节尽量详尽（建议每节≥150字）；只输出报告正文，不要寒暄。',
          health:
            '只输出"身体健康"相关内容（健康状况、易患疾病、养生建议、注意事项）。要求：严格使用 Markdown 小标题组织内容；结合八字深入分析；表述自然、有逻辑；每个小节尽量详尽（建议每节≥150字）；只输出报告正文，不要寒暄。',
        }

        const res = await fetch("/api/fortune-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instruction, prompt: prompts[dimension] }),
          signal: controller.signal,
        })
        const data = await res.json()
        if (!aborted && res.ok && data?.reply) {
          setter(data.reply)
        }
      } catch (e: any) {
        if (!aborted && e?.name !== "AbortError") {
          console.error(`[${dimension}] error:`, e)
        }
      }
    }

    const runAll = async () => {
      setSimpleLoading(true)
      setSimpleError(null)
      try {
        await Promise.all([
          fetchAnalysis("personality", setPersonalityMd),
          fetchAnalysis("career", setCareerMd),
          fetchAnalysis("relationship", setRelationshipMd),
          fetchAnalysis("health", setHealthMd),
        ])
      } catch (e: any) {
        if (!aborted) setSimpleError(e?.message || "分析失败，请刷新重试")
      } finally {
        if (!aborted) setSimpleLoading(false)
      }
    }

    runAll()

    return () => {
      aborted = true
      controller.abort()
    }
  }, [isSimpleMode, instruction, personalityMd, careerMd, relationshipMd, healthMd])

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
        if (!aborted) setPersonalityError(e?.name === "AbortError" ? "请求超时，请重试" : e?.message || "请求失败")
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

  const renderReportContent = () => {
    switch (reportType) {
      case "personality":
        return (
          <div className="p-4 md:p-6 space-y-4 text-sm leading-relaxed">
            {personalityLoading && <div className="text-muted-foreground">AI 正在生成个性报告...</div>}
            {personalityError && (
              <div className="space-y-2">
                <div className="text-destructive">{personalityError}</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPersonalityMd("")
                    setPersonalityError(null)
                    setReportType("personality")
                  }}
                >
                  重试生成
                </Button>
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
              birthInfo={
                hasAll
                  ? {
                      year: y,
                      month: m,
                      day: d,
                      hour: h,
                      minute: mi,
                      gender: gender as "male" | "female" | "男" | "女",
                    }
                  : undefined
              }
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
            birthInfo={
              hasAll
                ? { year: y, month: m, day: d, hour: h, minute: mi, gender: gender as "male" | "female" | "男" | "女" }
                : undefined
            }
          />
        )
    }
  }

  // 普通模式：简洁的四卡片布局
  if (isSimpleMode) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar subtitle="命理分析报告" />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2 md:mb-3 tracking-wide text-balance">
              您的命理分析
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {name && `${name} · `}
              {displayGender} · {baziResult.solarDate}
            </p>
          </div>

          <div className="space-y-5 md:space-y-6">
            {/* 性格内涵 */}
            <div className="border-2 border-border rounded-2xl p-5 md:p-7 bg-card shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 md:w-6 md:h-6 text-primary"
                  >
                    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                    <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                    <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                    <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-medium">性格内涵</h3>
              </div>
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{personalityMd}</ReactMarkdown>
              </div>
            </div>

            {/* 事业财运 */}
            <div className="border-2 border-border rounded-2xl p-5 md:p-7 bg-card shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 md:w-6 md:h-6 text-primary"
                  >
                    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-medium">事业财运</h3>
              </div>
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{careerMd}</ReactMarkdown>
              </div>
            </div>

            {/* 感情婚姻 */}
            <div className="border-2 border-border rounded-2xl p-5 md:p-7 bg-card shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 md:w-6 md:h-6 text-primary"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-medium">感情婚姻</h3>
              </div>
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{relationshipMd}</ReactMarkdown>
              </div>
            </div>

            {/* 身体健康 */}
            <div className="border-2 border-border rounded-2xl p-5 md:p-7 bg-card shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 md:w-6 md:h-6 text-primary"
                  >
                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-medium">身体健康</h3>
              </div>
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{healthMd}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-10 text-center">
            <Button variant="outline" onClick={() => router.back()} size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // 专业模式：原有的完整布局
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <TopBar subtitle="八字命理解读" />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left Panel */}
        <aside className="w-full md:w-[35%] border-b md:border-b-0 md:border-r border-border bg-card/30 flex flex-col overflow-hidden min-h-0">
          <div className="border-b border-border p-3 md:p-4 bg-card/50">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <Button
                variant={reportType === "basic" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("basic")}
                className="text-xs md:text-sm whitespace-nowrap flex-shrink-0"
              >
                基本信息
              </Button>
              <Button
                variant={reportType === "fortune" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("fortune")}
                className="text-xs md:text-sm whitespace-nowrap flex-shrink-0"
              >
                专业细盘
              </Button>
              <Button
                variant={reportType === "personality" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("personality")}
                className="text-xs md:text-sm whitespace-nowrap flex-shrink-0"
              >
                个性报告
              </Button>
              <Button
                variant={reportType === "deep" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("deep")}
                className="text-xs md:text-sm whitespace-nowrap flex-shrink-0"
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
                  <div className="max-w-[90%] md:max-max-w-[85%] rounded-lg px-4 md:px-6 py-3 md:py-4 bg-card border border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.15s]" />
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.3s]" />
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
      <div className="fixed inset-x-0 bottom-0 md:hidden z-40 border-t border-border bg-card/95 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
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
        <div
          className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${mobileChatOpen ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileChatOpen(false)} />
          <div
            className={`absolute inset-x-0 bottom-0 h-[85vh] bg-card rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${mobileChatOpen ? "translate-y-0" : "translate-y-full"}`}
          >
            <div className="py-2">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-muted" />
            </div>
            <div className="border-t border-border px-4 py-3 flex items-center justify-between">
              <div className="text-sm font-medium">AI 命理对话</div>
              <Button variant="ghost" size="sm" onClick={() => setMobileChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-3 w-3 text-secondary" />
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
                    <div className="max-w-[85%] rounded-lg px-3 py-2 bg-card border border-border">
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
              </div>
            </div>
            <div className="border-t border-border bg-card/95 backdrop-blur-sm px-3 py-3">
              <div className="flex gap-2 items-end">
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
                  className="flex-1 bg-background resize-none min-h-[44px] max-h-[120px] text-sm"
                  disabled={isLoading}
                  rows={2}
                />
                <Button
                  onClick={async () => {
                    await handleSend()
                  }}
                  disabled={isLoading || !input.trim()}
                  className="h-[44px] px-4"
                >
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
