"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, History, Globe, User, Sparkles } from "lucide-react"
import { MobileDatePicker } from "@/components/mobile-date-picker"
import { isLoggedIn } from "@/lib/utils"
import { TopBar } from "@/components/topbar"

type ServiceType = "bazi" | "liuyao"

type YaoType = "yang" | "yin"
type YaoState = "static" | "moving"

interface Yao {
  type: YaoType
  state: YaoState
  position: number
}

export default function CalculatePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [gender, setGender] = useState<"male" | "female">("male")
  const [dateType, setDateType] = useState<"solar" | "lunar" | "bazi" | "ai">("solar")
  const [language, setLanguage] = useState("zh")
  const [serviceType, setServiceType] = useState<ServiceType>("bazi")

  const [birthDateTime, setBirthDateTime] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: 12,
    minute: 0,
  })

  const [manualBazi, setManualBazi] = useState({
    year: "",
    month: "",
    day: "",
    hour: "",
  })

  const [aiInput, setAiInput] = useState("")

  const [liuyaoQuestion, setLiuyaoQuestion] = useState("")
  const [yaos, setYaos] = useState<Yao[]>([
    { type: "yang", state: "static", position: 6 },
    { type: "yin", state: "static", position: 5 },
    { type: "yang", state: "static", position: 4 },
    { type: "yin", state: "static", position: 3 },
    { type: "yang", state: "static", position: 2 },
    { type: "yin", state: "static", position: 1 },
  ])

  

  const toggleYaoType = (index: number) => {
    setYaos((prev) =>
      prev.map((yao, i) => (i === index ? { ...yao, type: yao.type === "yang" ? "yin" : "yang" } : yao)),
    )
  }

  const toggleYaoState = (index: number) => {
    setYaos((prev) =>
      prev.map((yao, i) => (i === index ? { ...yao, state: yao.state === "static" ? "moving" : "static" } : yao)),
    )
  }

  const renderYao = (yao: Yao, index: number) => {
    const isYang = yao.type === "yang"
    const isMoving = yao.state === "moving"
    const isOldYang = isYang && isMoving
    const isOldYin = !isYang && isMoving

    return (
      <div key={index} className="flex items-center gap-2 md:gap-4">
        <span className="text-xs text-muted-foreground w-8">{yao.position}爻</span>
        <div className="flex-1 flex items-center gap-2">
          <button
            onClick={() => toggleYaoType(index)}
            className="flex-1 h-10 md:h-12 rounded-lg border-2 border-border hover:border-secondary transition-colors relative overflow-hidden"
          >
            {isYang ? (
              <div className="h-full bg-muted flex items-center justify-center">
                <div className="w-full h-2 bg-foreground" />
              </div>
            ) : (
              <div className="h-full bg-muted flex items-center justify-center gap-2 px-4">
                <div className="flex-1 h-2 bg-foreground" />
                <div className="w-3" />
                <div className="flex-1 h-2 bg-foreground" />
              </div>
            )}
          </button>
          <Button
            variant={isMoving ? "default" : "outline"}
            size="sm"
            onClick={() => toggleYaoState(index)}
            className="w-12 md:w-16 h-8 text-xs md:text-sm"
          >
            {isMoving ? "动" : "静"}
          </Button>
          <div className="w-6 md:w-8 flex items-center justify-center">
            {isOldYang && (
              <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                <span className="text-secondary text-lg">○</span>
              </div>
            )}
            {isOldYin && (
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-destructive text-xl font-bold">×</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = () => {
    if (serviceType === "liuyao") {
      router.push("/liuyao")
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
    router.push(`/reading?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background hide-scrollbar overflow-y-auto">
      <TopBar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-wide text-balance">开启您的命理之旅</h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            输入您的生辰信息，让AI为您揭示命运的奥秘
          </p>
        </div>

        <div className="mb-8">
          <div className="flex gap-4 justify-center">
            <Button
              variant={serviceType === "bazi" ? "default" : "outline"}
              className="px-8"
              onClick={() => setServiceType("bazi")}
            >
              八字命理
            </Button>
            <Button
              variant={serviceType === "liuyao" ? "default" : "outline"}
              className="px-8"
              onClick={() => setServiceType("liuyao")}
            >
              六爻
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            {serviceType === "bazi" ? (
              <>
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <Label htmlFor="name" className="text-base mb-2 block">
                      姓名
                    </Label>
                    <Input
                      id="name"
                      placeholder="请输入您的姓名"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label className="text-base mb-2 block">性别</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={gender === "male" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setGender("male")}
                      >
                        男
                      </Button>
                      <Button
                        variant={gender === "female" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setGender("female")}
                      >
                        女
                      </Button>
                    </div>
                  </div>
                </div>

                <Tabs value={dateType} onValueChange={(v) => setDateType(v as any)} className="mb-0">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="solar">公历日期</TabsTrigger>
                    <TabsTrigger value="lunar">农历日期</TabsTrigger>
                    <TabsTrigger value="bazi">四柱八字</TabsTrigger>
                    <TabsTrigger value="ai">AI识别</TabsTrigger>
                  </TabsList>

                  <TabsContent value="solar" className="space-y-4">
                    <div>
                      <Label className="text-base mb-2 block">出生日期时间</Label>
                      <MobileDatePicker value={birthDateTime} onChange={setBirthDateTime} />
                      <p className="text-xs text-muted-foreground mt-2 font-light">
                        请尽量提供准确的出生时间，以获得更精准的分析结果
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="lunar" className="space-y-4">
                    <div>
                      <Label className="text-base mb-2 block">农历出生日期时间</Label>
                      <MobileDatePicker value={birthDateTime} onChange={setBirthDateTime} mode="lunar" />
                      <p className="text-xs text-muted-foreground mt-2 font-light">请选择农历日期和时间，系统将自动转换为公历</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="bazi" className="space-y-4">
                    <div>
                      <Label className="text-base mb-4 block">请输入四柱八字</Label>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm mb-2 block text-muted-foreground">年柱</Label>
                          <Input
                            placeholder="甲子"
                            value={manualBazi.year}
                            onChange={(e) => setManualBazi({ ...manualBazi, year: e.target.value })}
                            className="bg-background/50"
                          />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block text-muted-foreground">月柱</Label>
                          <Input
                            placeholder="乙丑"
                            value={manualBazi.month}
                            onChange={(e) => setManualBazi({ ...manualBazi, month: e.target.value })}
                            className="bg-background/50"
                          />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block text-muted-foreground">日柱</Label>
                          <Input
                            placeholder="丙寅"
                            value={manualBazi.day}
                            onChange={(e) => setManualBazi({ ...manualBazi, day: e.target.value })}
                            className="bg-background/50"
                          />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block text-muted-foreground">时柱</Label>
                          <Input
                            placeholder="丁卯"
                            value={manualBazi.hour}
                            onChange={(e) => setManualBazi({ ...manualBazi, hour: e.target.value })}
                            className="bg-background/50"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 font-light">
                        如果您已知自己的四柱八字，可以直接输入
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-4">
                    <div>
                      <Label className="text-base mb-2 block">描述您的出生信息</Label>
                      <Input
                        placeholder="例如：1990年5月20日下午3点"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        className="bg-background/50"
                      />
                      <p className="text-xs text-muted-foreground mt-2 font-light">
                        AI将自动识别并转换为准确的八字信息
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                
              </>
            ) : (
              <>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base mb-2 block">测算时间</Label>
                    <MobileDatePicker value={birthDateTime} onChange={setBirthDateTime} />
                    <p className="text-xs text-muted-foreground mt-2 font-light">请选择起卦时间</p>
                  </div>

                  <div>
                    <Label className="text-base mb-2 block">测算问题</Label>
                    <Textarea
                      placeholder="请输入您想要测算的问题，例如：近期事业发展如何？"
                      value={liuyaoQuestion}
                      onChange={(e) => setLiuyaoQuestion(e.target.value)}
                      className="bg-background/50 min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-2 font-light">问题越具体，解读越准确</p>
                  </div>

                  <div>
                    <Label className="text-base mb-4 block">选择爻象</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      点击爻位可切换阴阳，点击按钮可切换动静。老阳爻显示○，老阴爻显示×
                    </p>
                    <div className="space-y-3">{yaos.map((yao, index) => renderYao(yao, index))}</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-normal tracking-wide"
          onClick={handleSubmit}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          开始排盘
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6 font-light">
          您的隐私将受到严格保护 · 所有数据均加密存储
        </p>
      </main>
    </div>
  )
}
