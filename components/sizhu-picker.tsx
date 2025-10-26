"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { findDateByPillarsWithRange, type PillarsInput } from "@/lib/bazi-inverse"
import { toast } from "sonner"

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

export type SiZhu = {
  year: { stem?: string; branch?: string }
  month: { stem?: string; branch?: string }
  day: { stem?: string; branch?: string }
  hour: { stem?: string; branch?: string }
}

export function SiZhuPicker({
  defaultValue,
  onSolved,
}: {
  defaultValue?: SiZhu
  onSolved?: (d: Date) => void
}) {
  const [pillars, setPillars] = useState<SiZhu>(
    defaultValue || {
      year: {},
      month: {},
      day: {},
      hour: {},
    },
  )
  const [loading, setLoading] = useState(false)
  const [yearStart] = useState(1980)
  const [yearEnd] = useState(2030)
  const [minuteStep] = useState(60)

  const setP = (key: keyof SiZhu, part: "stem" | "branch", v: string) => {
    setPillars((prev) => ({ ...prev, [key]: { ...prev[key], [part]: v } }))
  }

  const trySolve = async () => {
    setLoading(true)
    try {
      const date = await new Promise<Date | null>((resolve) => {
        setTimeout(() => {
          const d = findDateByPillarsWithRange(pillars as PillarsInput, { yearStart, yearEnd, minuteStep })
          resolve(d)
        }, 0)
      })
      if (date) {
        onSolved?.(date)
        toast.success("已根据四柱反推出生时间", {
          description: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
          duration: 1800,
        })
      } else {
        toast("未找到匹配的阳历时间", {
          description: "请检查四柱组合或调整搜索范围/精度后重试",
          duration: 2200,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const Cell = ({
    label,
    value,
    onPick,
    list,
  }: {
    label: string
    value?: string
    onPick: (v: string) => void
    list: string[]
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`h-16 md:h-20 rounded-xl border-2 transition-all duration-200 w-full text-center ${
            value
              ? "border-primary bg-primary/5 hover:bg-primary/10"
              : "border-border bg-card hover:border-primary/50 hover:bg-muted"
          }`}
        >
          <span className={`text-2xl md:text-3xl font-medium ${value ? "text-foreground" : "text-muted-foreground"}`}>
            {value || label}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-[280px] p-4">
        <div className="grid grid-cols-6 gap-2">
          {list.map((it) => (
            <button
              key={it}
              type="button"
              onClick={() => onPick(it)}
              className={`h-12 rounded-lg border-2 text-lg font-medium transition-all duration-200 ${
                value === it
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border hover:border-primary/50 hover:bg-muted"
              }`}
            >
              {it}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="text-base font-medium text-muted-foreground">年柱</div>
          <div className="text-base font-medium text-muted-foreground">月柱</div>
          <div className="text-base font-medium text-muted-foreground">日柱</div>
          <div className="text-base font-medium text-muted-foreground">时柱</div>
        </div>

        {/* 天干 */}
        <div className="grid grid-cols-4 gap-3">
          <Cell label="天干" value={pillars.year.stem} onPick={(v) => setP("year", "stem", v)} list={STEMS} />
          <Cell label="天干" value={pillars.month.stem} onPick={(v) => setP("month", "stem", v)} list={STEMS} />
          <Cell label="天干" value={pillars.day.stem} onPick={(v) => setP("day", "stem", v)} list={STEMS} />
          <Cell label="天干" value={pillars.hour.stem} onPick={(v) => setP("hour", "stem", v)} list={STEMS} />
        </div>

        {/* 地支 */}
        <div className="grid grid-cols-4 gap-3">
          <Cell label="地支" value={pillars.year.branch} onPick={(v) => setP("year", "branch", v)} list={BRANCHES} />
          <Cell label="地支" value={pillars.month.branch} onPick={(v) => setP("month", "branch", v)} list={BRANCHES} />
          <Cell label="地支" value={pillars.day.branch} onPick={(v) => setP("day", "branch", v)} list={BRANCHES} />
          <Cell label="地支" value={pillars.hour.branch} onPick={(v) => setP("hour", "branch", v)} list={BRANCHES} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={trySolve} disabled={loading} size="lg" className="min-w-[180px] h-12 text-base font-medium">
          {loading ? "正在查找…" : "反推阳历日期"}
        </Button>
      </div>
    </div>
  )
}
