"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type YaoType = "yang" | "yin"
type YaoState = "static" | "moving"

interface Yao {
  type: YaoType
  state: YaoState
  position: number
}

export function LiuyaoChart({ locked = true }: { locked?: boolean }) {
  const [yaos, setYaos] = useState<Yao[]>([
    { type: "yang", state: "static", position: 6 },
    { type: "yin", state: "moving", position: 5 },
    { type: "yang", state: "static", position: 4 },
    { type: "yin", state: "static", position: 3 },
    { type: "yang", state: "moving", position: 2 },
    { type: "yin", state: "static", position: 1 },
  ])

  const toggleYaoType = (index: number) => {
    if (locked) return
    setYaos((prev) =>
      prev.map((yao, i) => (i === index ? { ...yao, type: yao.type === "yang" ? "yin" : "yang" } : yao)),
    )
  }

  const toggleYaoState = (index: number) => {
    if (locked) return
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
            className={
              "flex-1 h-10 md:h-12 rounded-lg border-2 border-border transition-colors relative overflow-hidden " +
              (locked ? "cursor-default" : "hover:border-secondary cursor-pointer")
            }
            disabled={locked}
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
            {isMoving && (
              <span
                className={
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full ring-2 " +
                  (isOldYang ? "bg-secondary ring-secondary/40" : "bg-destructive ring-destructive/40")
                }
              />
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="space-y-3">
        <h2 className="text-xl md:text-2xl font-bold text-gradient">六爻卦象</h2>
        <p className="text-xs md:text-sm text-muted-foreground">已排盘卦象展示</p>
      </div>

      <div className="border border-border rounded-lg p-4 md:p-6 space-y-3 md:space-y-4 bg-card/50">
        {yaos.map((yao, index) => renderYao(yao, index))}
      </div>

      <div className="space-y-4">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-base font-bold mb-3">本卦</h3>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-secondary mb-2">地天泰</div>
            <div className="text-sm text-muted-foreground">坤上乾下</div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4">
          <h3 className="text-base font-bold mb-3">变卦</h3>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-secondary mb-2">雷天大壮</div>
            <div className="text-sm text-muted-foreground">震上乾下</div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4">
          <h3 className="text-base font-bold mb-3">卦辞</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            泰：小往大来，吉亨。则是天地交而万物通也，上下交而其志同也。
          </p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <h3 className="text-base font-bold mb-3">世应</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">世爻：</span>
              <span className="font-medium">二爻</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">应爻：</span>
              <span className="font-medium">五爻</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
