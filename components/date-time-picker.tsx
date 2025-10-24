"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  lunar?: boolean
}

export function DateTimePicker({ value, onChange, lunar = false }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState(value?.getFullYear() ?? new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(value?.getMonth() ?? new Date().getMonth())
  const [selectedDay, setSelectedDay] = useState(value?.getDate() ?? new Date().getDate())
  const [selectedHour, setSelectedHour] = useState(value?.getHours() ?? 12)
  const [selectedMinute, setSelectedMinute] = useState(value?.getMinutes() ?? 0)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear }, (_, i) => currentYear - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const daysInMonth = (year: number, month0: number) => new Date(year, month0 + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1)
  const hours = lunar
    ? [
        { label: "子时(23-01)", start: 23 },
        { label: "丑时(01-03)", start: 1 },
        { label: "寅时(03-05)", start: 3 },
        { label: "卯时(05-07)", start: 5 },
        { label: "辰时(07-09)", start: 7 },
        { label: "巳时(09-11)", start: 9 },
        { label: "午时(11-13)", start: 11 },
        { label: "未时(13-15)", start: 13 },
        { label: "申时(15-17)", start: 15 },
        { label: "酉时(17-19)", start: 17 },
        { label: "戌时(19-21)", start: 19 },
        { label: "亥时(21-23)", start: 21 },
      ]
    : Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  // Refs for scroll containers
  const yearListRef = useRef<HTMLDivElement>(null)
  const monthListRef = useRef<HTMLDivElement>(null)
  const dayListRef = useRef<HTMLDivElement>(null)
  const hourListRef = useRef<HTMLDivElement>(null)
  const minuteListRef = useRef<HTMLDivElement>(null)

  // Generic scroll-to-select helper
  function makeScrollHandler<T>(ref: RefObject<HTMLDivElement | null>, items: T[], getValue: (item: T, index: number) => number, onSelect: (val: number) => void) {
    let rAF = 0 as number | any
    let endTimer: any
    const snap = () => {
      const container = ref.current
      if (!container) return
      const buttons = container.querySelectorAll<HTMLButtonElement>("button[data-picker-item='true']")
      if (!buttons.length) return
      const containerCenter = container.scrollTop + container.clientHeight / 2
      let bestIdx = 0
      let bestDelta = Infinity
      buttons.forEach((btn, idx) => {
        const mid = btn.offsetTop + btn.clientHeight / 2
        const d = Math.abs(mid - containerCenter)
        if (d < bestDelta) {
          bestDelta = d
          bestIdx = idx
        }
      })
      const targetBtn = buttons[bestIdx]
      if (targetBtn) {
        const val = getValue(items[bestIdx], bestIdx)
        onSelect(val)
        // snap align
        container.scrollTo({ top: targetBtn.offsetTop - (container.clientHeight - targetBtn.clientHeight) / 2, behavior: 'smooth' })
      }
    }
    return () => {
      if (rAF) cancelAnimationFrame(rAF)
      rAF = requestAnimationFrame(() => {
        if (endTimer) clearTimeout(endTimer)
        endTimer = setTimeout(snap, 80)
      })
    }
  }

  const onYearScroll = makeScrollHandler<number>(yearListRef, years, (item) => item, (val) => setSelectedYear(val))
  const onMonthScroll = makeScrollHandler<number>(monthListRef, months, (item) => item - 1, (val) => setSelectedMonth(val))
  const onDayScroll = makeScrollHandler<number>(dayListRef, days, (item) => item, (val) => setSelectedDay(val))
  const onHourScroll = lunar
    ? makeScrollHandler<{ label: string; start: number }>(hourListRef, hours as { label: string; start: number }[], (item) => item.start % 24, (val) => setSelectedHour(val))
    : makeScrollHandler<number>(hourListRef, hours as number[], (item) => item, (val) => setSelectedHour(val))
  const onMinuteScroll = makeScrollHandler<number>(minuteListRef, minutes, (item) => item, (val) => setSelectedMinute(val))

  useEffect(() => {
    if (!isOpen) return
    const now = new Date()
    setSelectedYear(now.getFullYear())
    setSelectedMonth(now.getMonth())
    setSelectedDay(now.getDate())
    setSelectedHour(now.getHours())
    setSelectedMinute(now.getMinutes())

    const centerByIndex = (ref: RefObject<HTMLDivElement | null>, index: number) => {
      const container = ref.current
      if (!container) return
      const items = container.querySelectorAll<HTMLButtonElement>("button[data-picker-item='true']")
      const target = items[index]
      if (!target) return
      const containerRect = container.getBoundingClientRect()
      const itemRect = target.getBoundingClientRect()
      const offset = target.offsetTop - (containerRect.height - itemRect.height) / 2
      container.scrollTop = offset
    }

    const id = requestAnimationFrame(() => {
      centerByIndex(yearListRef, Math.max(0, years.indexOf(now.getFullYear())))
      centerByIndex(monthListRef, Math.max(0, now.getMonth()))
      centerByIndex(dayListRef, Math.max(0, now.getDate() - 1))
      const hourIdx = lunar
        ? (hours as { label: string; start: number }[]).findIndex(h => (h.start % 24) === now.getHours())
        : now.getHours()
      centerByIndex(hourListRef, Math.max(0, hourIdx))
      centerByIndex(minuteListRef, Math.max(0, now.getMinutes()))
    })

    return () => cancelAnimationFrame(id)
  }, [isOpen, lunar, years])

  const handleConfirm = () => {
    const date = new Date(0)
    date.setFullYear(selectedYear, selectedMonth, selectedDay)
    date.setHours(selectedHour, selectedMinute, 0, 0)
    onChange(date)
    setIsOpen(false)
  }

  // 保证选中日期不超过当月最大天数
  useEffect(() => {
    if (selectedDay > days.length) {
      setSelectedDay(days.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, days.length])

  const formatDate = (date: Date | null) => {
    if (!date) return "选择日期时间"
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    const hh = String(date.getHours()).padStart(2, "0")
    const mm = String(date.getMinutes()).padStart(2, "0")
    if (lunar) {
      return `${y}年${Number(m)}月${Number(d)}日 ${hh}:${mm}`
    }
    return `${y}-${m}-${d} ${hh}:${mm}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-background/50",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            {/* Year Picker */}
            <div className="flex-1">
              <div className="text-sm font-medium mb-2 text-center">年</div>
              <div ref={yearListRef} onScroll={onYearScroll} className="h-48 overflow-y-auto border rounded-md">
                {years.map((year) => (
                  <button
                    key={year}
                    data-picker-item="true"
                    onClick={() => setSelectedYear(year)}
                    className={cn(
                      "w-full px-3 py-2 text-sm hover:bg-accent",
                      selectedYear === year && "bg-secondary/20 text-foreground border border-secondary/30",
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Picker */}
            <div className="flex-1">
              <div className="text-sm font-medium mb-2 text-center">月</div>
              <div ref={monthListRef} onScroll={onMonthScroll} className="h-48 overflow-y-auto border rounded-md">
                {months.map((month) => (
                  <button
                    key={month}
                    data-picker-item="true"
                    onClick={() => setSelectedMonth(month - 1)}
                    className={cn(
                      "w-full px-3 py-2 text-sm hover:bg-accent",
                      selectedMonth === month - 1 && "bg-secondary/20 text-foreground border border-secondary/30",
                    )}
                  >
                    {month}月
                  </button>
                ))}
              </div>
            </div>

            {/* Day Picker */}
            <div className="flex-1">
              <div className="text-sm font-medium mb-2 text-center">日</div>
              <div ref={dayListRef} onScroll={onDayScroll} className="h-48 overflow-y-auto border rounded-md">
                {days.map((day) => (
                  <button
                    key={day}
                    data-picker-item="true"
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "w-full px-3 py-2 text-sm hover:bg-accent",
                      selectedDay === day && "bg-secondary/20 text-foreground border border-secondary/30",
                    )}
                  >
                    {day}日
                  </button>
                ))}
              </div>
            </div>

            {/* Hour Picker */}
            <div className="flex-1">
              <div className="text-sm font-medium mb-2 text-center">{lunar ? "时辰" : "时"}</div>
              <div ref={hourListRef} onScroll={onHourScroll} className="h-48 overflow-y-auto border rounded-md">
                {(
                  lunar
                    ? hours
                    : (hours as number[])
                  ).map((hour: any, index: number) => (
                  <button
                    key={index}
                    data-picker-item="true"
                    onClick={() =>
                      setSelectedHour(
                        lunar ? (hour.start % 24) : (hour as number)
                      )
                    }
                    className={cn(
                      "w-full px-3 py-2 text-sm hover:bg-accent whitespace-nowrap",
                      selectedHour === (lunar ? (hour.start % 24) : hour) && "bg-secondary/20 text-foreground border border-secondary/30",
                    )}
                  >
                    {lunar ? hour.label : `${hour}时`}
                  </button>
                ))}
              </div>
            </div>

            {/* Minute Picker */}
            <div className="flex-1">
              <div className="text-sm font-medium mb-2 text-center">分</div>
              <div ref={minuteListRef} onScroll={onMinuteScroll} className="h-48 overflow-y-auto border rounded-md">
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    data-picker-item="true"
                    onClick={() => setSelectedMinute(minute)}
                    className={cn(
                      "w-full px-3 py-2 text-sm hover:bg-accent",
                      selectedMinute === minute && "bg-secondary/20 text-foreground border border-secondary/30",
                    )}
                  >
                    {String(minute).padStart(2, "0")}分
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleConfirm} className="w-full">
            确认
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
