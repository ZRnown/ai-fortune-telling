"use client"

import { useState } from "react"

type YaoType = "yang" | "yin"
type YaoState = "static" | "moving"

interface Yao {
  type: YaoType
  state: YaoState
  position: number
}

const transformYaos = (yaos: Yao[]): Yao[] => {
  return yaos.map((yao) => {
    if (yao.state === "moving") {
      // 老阳变少阴，老阴变少阳
      return {
        ...yao,
        type: yao.type === "yang" ? "yin" : "yang",
        state: "static" as YaoState,
      }
    }
    return yao
  })
}

export function LiuyaoChart({ locked = true }: { locked?: boolean }) {
  const [yaos] = useState<Yao[]>([
    { type: "yang", state: "static", position: 6 },
    { type: "yin", state: "moving", position: 5 },
    { type: "yang", state: "static", position: 4 },
    { type: "yin", state: "static", position: 3 },
    { type: "yang", state: "moving", position: 2 },
    { type: "yin", state: "static", position: 1 },
  ])

  const transformedYaos = transformYaos(yaos)

  const renderYao = (yao: Yao, index: number, showMoving = true) => {
    const isYang = yao.type === "yang"
    const isMoving = yao.state === "moving" && showMoving

    return (
      <div key={index} className="flex items-center gap-2 md:gap-3">
        <span className="text-xs md:text-sm font-medium text-muted-foreground w-10 md:w-12">{yao.position}爻</span>
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-10 md:h-12 rounded-lg border-2 border-border relative overflow-hidden bg-card shadow-sm">
            {isYang ? (
              <div className="h-full bg-muted/50 flex items-center justify-center">
                <div className="w-[85%] h-2.5 md:h-3 bg-foreground rounded-full" />
              </div>
            ) : (
              <div className="h-full bg-muted/50 flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6">
                <div className="flex-1 h-2.5 md:h-3 bg-foreground rounded-full" />
                <div className="w-3 md:w-4" />
                <div className="flex-1 h-2.5 md:h-3 bg-foreground rounded-full" />
              </div>
            )}
            {isMoving && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${isYang ? "bg-secondary" : "bg-destructive"} ring-2 md:ring-4 ${isYang ? "ring-secondary/30" : "ring-destructive/30"}`}
                />
              </div>
            )}
          </div>
          <div className="w-12 md:w-16 h-10 md:h-12 rounded-lg border-2 border-border bg-card flex items-center justify-center">
            <span className="text-sm md:text-base font-medium">{isMoving ? "动" : "静"}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gradient">六爻卦象</h2>
        <p className="text-xs md:text-sm text-muted-foreground">已排盘卦象展示</p>
      </div>

      <div className="border-2 border-border rounded-2xl p-4 md:p-6 space-y-3 md:space-y-4 bg-card/50 shadow-lg">
        <h3 className="text-base md:text-lg font-medium text-center text-secondary mb-2 md:mb-4">本卦</h3>
        {yaos.map((yao, index) => renderYao(yao, index, true))}
      </div>

      <div className="grid md:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
        <div className="border-2 border-border rounded-2xl p-4 md:p-6 bg-gradient-to-br from-card to-card/50 shadow-lg space-y-3 md:space-y-4">
          <h3 className="text-base md:text-lg font-medium text-secondary text-center mb-2">变卦</h3>
          {transformedYaos.map((yao, index) => renderYao(yao, index, false))}
        </div>

        <div className="border-2 border-border rounded-2xl p-4 md:p-6 bg-gradient-to-br from-card to-card/50 shadow-lg">
          <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 text-secondary text-center">伏藏卦</h3>
          <div className="text-center space-y-2 md:space-y-3">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient">天风姤</div>
            <div className="text-sm md:text-base text-muted-foreground">乾上巽下</div>
            <div className="pt-2 md:pt-3 border-t border-border">
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">姤，女壮，勿用取女</p>
            </div>
          </div>
        </div>
      </div>

      {/* 世应 */}
      <div className="border-2 border-border rounded-2xl p-6 bg-card/50 shadow-lg">
        <h3 className="text-lg font-medium mb-4 text-secondary">世应</h3>
        <div className="grid grid-cols-2 gap-4 text-base">
          <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
            <span className="text-muted-foreground">世爻：</span>
            <span className="font-medium">二爻</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
            <span className="text-muted-foreground">应爻：</span>
            <span className="font-medium">五爻</span>
          </div>
        </div>
      </div>
    </div>
  )
}
