"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MobileDatePicker } from "@/components/mobile-date-picker"

type YaoType = "yang" | "yin"
type YaoState = "static" | "moving"

interface Yao {
  type: YaoType
  state: YaoState
  position: number
}

interface LiuyaoInputProps {
  onChange?: (data: any) => void
  onDateTimeChange?: (dateTime: any) => void
}

export function LiuyaoInput({ onChange, onDateTimeChange }: LiuyaoInputProps) {
  const [question, setQuestion] = useState("")
  const [birthDateTime, setBirthDateTime] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  })

  const [yaos, setYaos] = useState<Yao[]>([
    { type: "yang", state: "static", position: 6 },
    { type: "yin", state: "static", position: 5 },
    { type: "yang", state: "static", position: 4 },
    { type: "yin", state: "static", position: 3 },
    { type: "yang", state: "static", position: 2 },
    { type: "yin", state: "static", position: 1 },
  ])

  const toggleYaoType = (index: number) => {
    const newYaos = yaos.map((yao, i) => (i === index ? { ...yao, type: yao.type === "yang" ? "yin" : "yang" } : yao))
    setYaos(newYaos)
    onChange?.({ question, yaos: newYaos, dateTime: birthDateTime })
  }

  const toggleYaoState = (index: number) => {
    const newYaos = yaos.map((yao, i) =>
      i === index ? { ...yao, state: yao.state === "static" ? "moving" : "static" } : yao,
    )
    setYaos(newYaos)
    onChange?.({ question, yaos: newYaos, dateTime: birthDateTime })
  }

  const handleDateTimeChange = (newDateTime: any) => {
    setBirthDateTime(newDateTime)
    onDateTimeChange?.(newDateTime)
    onChange?.({ question, yaos, dateTime: newDateTime })
  }

  const handleQuestionChange = (newQuestion: string) => {
    setQuestion(newQuestion)
    onChange?.({ question: newQuestion, yaos, dateTime: birthDateTime })
  }

  const renderYao = (yao: Yao, index: number) => {
    const isYang = yao.type === "yang"
    const isMoving = yao.state === "moving"

    return (
      <div key={index} className="flex items-center gap-3 md:gap-4">
        <span className="text-sm font-medium text-muted-foreground w-12">{yao.position}爻</span>
        <div className="flex-1 flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleYaoType(index)}
            className="flex-1 h-14 md:h-16 rounded-xl border-2 border-border hover:border-primary transition-all duration-200 relative overflow-hidden bg-card shadow-sm hover:shadow-md"
          >
            {isYang ? (
              <div className="h-full bg-muted/50 flex items-center justify-center">
                <div className="w-[85%] h-3 bg-foreground rounded-full" />
              </div>
            ) : (
              <div className="h-full bg-muted/50 flex items-center justify-center gap-3 px-6">
                <div className="flex-1 h-3 bg-foreground rounded-full" />
                <div className="w-4" />
                <div className="flex-1 h-3 bg-foreground rounded-full" />
              </div>
            )}
          </button>
          <Button
            type="button"
            variant={isMoving ? "default" : "outline"}
            size="lg"
            onClick={() => toggleYaoState(index)}
            className="w-16 md:w-20 h-14 md:h-16 text-base font-medium"
          >
            {isMoving ? "动" : "静"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base mb-3 block font-medium">起卦时间</Label>
        <MobileDatePicker value={birthDateTime} onChange={handleDateTimeChange} />
        <p className="text-sm text-muted-foreground mt-3 font-light">请选择起卦时间</p>
      </div>

      <div>
        <Label className="text-base mb-3 block font-medium">测算问题</Label>
        <Textarea
          placeholder="请输入您想要测算的问题，例如：近期事业发展如何？"
          value={question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="bg-background/50 min-h-[120px] text-base resize-none"
        />
        <p className="text-sm text-muted-foreground mt-3 font-light">问题越具体，解读越准确</p>
      </div>

      <div>
        <Label className="text-base mb-4 block font-medium">选择爻象</Label>
        <p className="text-sm text-muted-foreground mb-4">点击爻位可切换阴阳，点击按钮可切换动静</p>
        <div className="space-y-3 bg-card/50 rounded-xl p-4 border-2 border-border">
          {yaos.map((yao, index) => renderYao(yao, index))}
        </div>
      </div>
    </div>
  )
}
