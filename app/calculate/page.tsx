"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { MobileDatePicker } from "@/components/mobile-date-picker"
import { TopBar } from "@/components/topbar"
import { SiZhuPicker } from "@/components/sizhu-picker"
import { LiuyaoInput } from "@/components/liuyao-input"

type ServiceType = "bazi" | "liuyao"
type ModeType = "professional" | "simple"
type DateInputType = "solar" | "lunar" | "bazi" | "ai"

export default function CalculatePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [gender, setGender] = useState<"male" | "female">("male")
  const [dateType, setDateType] = useState<DateInputType>("solar")
  const [serviceType, setServiceType] = useState<ServiceType>("bazi")
  const [mode, setMode] = useState<ModeType>("simple")

  const [birthDateTime, setBirthDateTime] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: 12,
    minute: 0,
  })

  const [aiInput, setAiInput] = useState("")
  const [liuyaoData, setLiuyaoData] = useState<any>(null)

  const handleSubmit = () => {
    if (serviceType === "liuyao") {
      const params = new URLSearchParams()
      if (liuyaoData) {
        params.set("data", JSON.stringify(liuyaoData))
      }
      router.push(`/liuyao?${params.toString()}`)
      return
    }

    const { year, month, day, hour, minute } = birthDateTime
    const params = new URLSearchParams()
    if (name) params.set("name", name)
    params.set("gender", gender === "male" ? "男" : "女")
    params.set("y", String(year))
    params.set("m", String(month))
    params.set("d", String(day))
    params.set("h", String(hour))
    params.set("mi", String(minute))
    params.set("mode", mode)

    if (mode === "simple") {
      params.set("analysis", "personality,career,relationship,health")
    }
    router.push(`/reading?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background hide-scrollbar overflow-y-auto">
      <TopBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 md:mb-6 tracking-wide text-balance">
            开启您的命理之旅
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl font-light leading-relaxed px-2">
            输入您的生辰信息，让AI为您揭示命运的奥秘
          </p>
        </div>

        <div className="mb-8 md:mb-10">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <button
              onClick={() => setServiceType("bazi")}
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                serviceType === "bazi"
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md"
              }`}
            >
              <div className="p-6 md:p-8 text-center">
                <div
                  className={`text-4xl md:text-5xl mb-3 transition-transform duration-300 ${serviceType === "bazi" ? "scale-110" : "group-hover:scale-105"}`}
                >
                  ☯
                </div>
                <h3 className="text-xl md:text-2xl font-medium mb-2">八字命理</h3>
                <p className="text-sm text-muted-foreground">四柱推命 · 洞悉人生</p>
              </div>
              {serviceType === "bazi" && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            <button
              onClick={() => setServiceType("liuyao")}
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                serviceType === "liuyao"
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md"
              }`}
            >
              <div className="p-6 md:p-8 text-center">
                <div
                  className={`text-4xl md:text-5xl mb-3 transition-transform duration-300 ${serviceType === "liuyao" ? "scale-110" : "group-hover:scale-105"}`}
                >
                  ䷀
                </div>
                <h3 className="text-xl md:text-2xl font-medium mb-2">六爻占卜</h3>
                <p className="text-sm text-muted-foreground">起卦问事 · 趋吉避凶</p>
              </div>
              {serviceType === "liuyao" && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        <Card className="mb-8 shadow-lg border-2">
          <CardContent className="pt-6">
            {serviceType === "bazi" ? (
              <>
                <div className="mb-8 flex justify-center">
                  <Tabs value={mode} onValueChange={(v) => setMode(v as ModeType)} className="w-full max-w-md">
                    <TabsList className="grid grid-cols-2 w-full h-12">
                      <TabsTrigger value="simple" className="text-base">
                        普通模式
                      </TabsTrigger>
                      <TabsTrigger value="professional" className="text-base">
                        专业模式
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* 基本信息 */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <Label htmlFor="name" className="text-base mb-3 block font-medium">
                      姓名
                    </Label>
                    <Input
                      id="name"
                      placeholder="请输入您的姓名"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-background/50 h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-base mb-3 block font-medium">性别</Label>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={gender === "male" ? "default" : "outline"}
                        className="flex-1 h-12 text-base"
                        onClick={() => setGender("male")}
                      >
                        男
                      </Button>
                      <Button
                        type="button"
                        variant={gender === "female" ? "default" : "outline"}
                        className="flex-1 h-12 text-base"
                        onClick={() => setGender("female")}
                      >
                        女
                      </Button>
                    </div>
                  </div>
                </div>

                <Tabs value={dateType} onValueChange={(v) => setDateType(v as DateInputType)} className="mb-0">
                  <TabsList className="grid w-full grid-cols-4 mb-6 h-12">
                    <TabsTrigger value="solar" className="text-sm md:text-base">
                      公历
                    </TabsTrigger>
                    <TabsTrigger value="lunar" className="text-sm md:text-base">
                      农历
                    </TabsTrigger>
                    <TabsTrigger value="bazi" className="text-sm md:text-base">
                      四柱
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="text-sm md:text-base">
                      AI识别
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="solar" className="space-y-4">
                    <div>
                      <Label className="text-base mb-3 block font-medium">出生日期时间</Label>
                      <MobileDatePicker value={birthDateTime} onChange={setBirthDateTime} />
                      <p className="text-sm text-muted-foreground mt-3 font-light">
                        请尽量提供准确的出生时间，以获得更精准的分析结果
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="lunar" className="space-y-4">
                    <div>
                      <Label className="text-base mb-3 block font-medium">农历出生日期时间</Label>
                      <MobileDatePicker value={birthDateTime} onChange={setBirthDateTime} mode="lunar" />
                      <p className="text-sm text-muted-foreground mt-3 font-light">
                        请选择农历日期和时间，系统将自动转换为公历
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="bazi" className="space-y-4">
                    <div>
                      <Label className="text-base mb-3 block font-medium">输入四柱八字</Label>
                      <SiZhuPicker
                        onSolved={(date) => {
                          setBirthDateTime({
                            year: date.getFullYear(),
                            month: date.getMonth() + 1,
                            day: date.getDate(),
                            hour: date.getHours(),
                            minute: date.getMinutes(),
                          })
                        }}
                      />
                      <p className="text-sm text-muted-foreground mt-3 font-light">
                        输入已知的四柱八字，系统将反推出生日期时间
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-4">
                    <div>
                      <Label className="text-base mb-3 block font-medium">描述您的出生信息</Label>
                      <Input
                        placeholder="例如：1990年5月20日下午3点"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        className="bg-background/50 h-12 text-base"
                      />
                      <p className="text-sm text-muted-foreground mt-3 font-light">
                        AI将自动识别并转换为准确的八字信息
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <LiuyaoInput onChange={(data) => setLiuyaoData(data)} onDateTimeChange={setBirthDateTime} />
            )}
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={handleSubmit}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          开始{serviceType === "bazi" ? "排盘" : "起卦"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6 font-light">
          您的隐私将受到严格保护 · 所有数据均加密存储
        </p>
      </main>
    </div>
  )
}
