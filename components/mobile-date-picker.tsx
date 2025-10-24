"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import lunisolar from "lunisolar"

interface MobileDatePickerProps {
  value: { year: number; month: number; day: number; hour: number; minute: number }
  onChange: (value: { year: number; month: number; day: number; hour: number; minute: number }) => void
  mode?: 'solar' | 'lunar'
}

export function MobileDatePicker({ value, onChange, mode = 'solar' }: MobileDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const [isLeapMonth, setIsLeapMonth] = useState(false)

  const yearRef = useRef<HTMLDivElement>(null)
  const monthRef = useRef<HTMLDivElement>(null)
  const dayRef = useRef<HTMLDivElement>(null)
  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear }, (_, i) => currentYear - i)

  // 解决 JS Date 年份 < 100 被当作 1900+year 的问题
  const makeDate = (year: number, monthIndex: number, day: number) => {
    const d = new Date(0)
    d.setMilliseconds(0)
    d.setSeconds(0)
    d.setMinutes(0)
    d.setHours(0)
    d.setFullYear(year)
    d.setMonth(monthIndex, day)
    return d
  }

  // 传统中文月/日名
  const monthNames = [
    '正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'
  ]
  const dayNames = [
    '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
    '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
    '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','卅十'
  ]
  const toCnYear = (year: number) => {
    const map: Record<string, string> = { '0': '〇', '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六', '7': '七', '8': '八', '9': '九' }
    return String(year).split('').map(ch => map[ch] ?? ch).join('')
  }
  
  // 月份集合
  type MonthItem = number | { m: number; isLeap: boolean; label: string }
  const getMonths = (): MonthItem[] => {
    if (mode !== 'lunar') return Array.from({ length: 12 }, (_, i) => i + 1)
    try {
      const lsr = lunisolar(makeDate(tempValue.year, 0, 1))
      const leapMonth: number = (lsr as any).lunar?.leapMonth || 0
      const arr: { m: number; isLeap: boolean; label: string }[] = []
      for (let m = 1; m <= 12; m++) {
        arr.push({ m, isLeap: false, label: monthNames[m-1] || `${m}月` })
        // 按需求：完全删除闰月选项，不再加入闰月
      }
      return arr
    } catch {
      return Array.from({ length: 12 }, (_, i) => i + 1)
    }
  }
  const months: MonthItem[] = getMonths()
  
  // 扫描法：获取指定农历月（含闰月标记）的天数（29/30）
  const getLunarMonthDays = (lunarYear: number, lunarMonth: number, isLeap: boolean) => {
    // 扫描范围：从该公历年的1月1日到次年的二月中旬，覆盖当年农历年所有月份
    const start = makeDate(lunarYear, 0, 1)
    const end = makeDate(lunarYear + 1, 1, 28)
    let maxDay = 0
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const lsr = lunisolar(d)
      const lunar: any = (lsr as any).lunar
      if (!lunar) continue
      if (lunar.year !== lunarYear) continue
      if (!!lunar.isLeapMonth !== isLeap) continue
      if (lunar.month === lunarMonth) {
        if (typeof lunar.day === 'number') maxDay = Math.max(maxDay, lunar.day)
      }
    }
    return maxDay || 29
  }

  // 扫描法：将农历转为公历日期
  const solarFromLunar = (lunarYear: number, lunarMonth: number, lunarDay: number, isLeap: boolean): Date | null => {
    const start = makeDate(lunarYear, 0, 1)
    const end = makeDate(lunarYear + 1, 1, 28)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const lsr = lunisolar(d)
      const lunar: any = (lsr as any).lunar
      if (!lunar) continue
      if (lunar.year !== lunarYear) continue
      if (!!lunar.isLeapMonth !== isLeap) continue
      if (lunar.month === lunarMonth && lunar.day === lunarDay) {
        return new Date(d)
      }
    }
    return null
  }

  const daysInMonth = (year: number, month: number) => {
    if (mode === 'lunar') {
      try {
        const max = getLunarMonthDays(year, month, isLeapMonth)
        return max
      } catch {
        return 29
      }
    }
    return new Date(year, month, 0).getDate()
  }
  
  const days = Array.from({ length: daysInMonth(tempValue.year, tempValue.month) }, (_, i) => i + 1)
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  // 优化的滚动处理：更流畅的吸附和选中
  function makeScrollHandler<T>(ref: { current: HTMLDivElement | null }, items: T[], getValue: (item: T, idx: number) => number, onSelect: (val: number) => void) {
    let endTimer: any
    const snap = () => {
      const container = ref.current
      if (!container) return
      const buttons = container.querySelectorAll<HTMLButtonElement>("button[data-picker-item='true']")
      if (!buttons.length) return
      const center = container.scrollTop + container.clientHeight / 2
      let bestIdx = 0
      let bestDelta = Infinity
      buttons.forEach((btn, idx) => {
        const mid = btn.offsetTop + btn.clientHeight / 2
        const d = Math.abs(mid - center)
        if (d < bestDelta) { bestDelta = d; bestIdx = idx }
      })
      const target = buttons[bestIdx]
      if (!target) return
      const val = getValue(items[bestIdx], bestIdx)
      onSelect(val)
      const offset = target.offsetTop - (container.clientHeight - target.clientHeight) / 2
      container.scrollTo({ top: offset, behavior: 'smooth' })
    }
    return (_e: React.UIEvent<HTMLDivElement>) => {
      if (endTimer) clearTimeout(endTimer)
      endTimer = setTimeout(snap, 150)
    }
  }

  const onYearScroll = makeScrollHandler<number>(yearRef, years, (v) => v, (v) => setTempValue((t) => ({ ...t, year: v })))
  // 月份滚动需要考虑闰月与复合项
  const monthTimerRef = useRef<any>(null)
  const onMonthScroll: React.UIEventHandler<HTMLDivElement> = (_e) => {
    if (monthTimerRef.current) clearTimeout(monthTimerRef.current)
    monthTimerRef.current = setTimeout(() => {
      const container = monthRef.current
      if (!container) return
      const buttons = container.querySelectorAll<HTMLButtonElement>("button[data-picker-item='true']")
      if (!buttons.length) return
      const center = container.scrollTop + container.clientHeight / 2
      let bestIdx = 0
      let bestDelta = Infinity
      buttons.forEach((btn, idx) => {
        const mid = (btn as HTMLButtonElement).offsetTop + (btn as HTMLButtonElement).clientHeight / 2
        const d = Math.abs(mid - center)
        if (d < bestDelta) { bestDelta = d; bestIdx = idx }
      })
      const target = buttons[bestIdx]
      if (!target) return
      const item = months[bestIdx]
      if (typeof item === 'number') {
        setIsLeapMonth(false)
        setTempValue((t) => {
          const max = daysInMonth(t.year, item)
          const day = Math.min(t.day, max)
          return { ...t, month: item, day }
        })
      } else {
        // 不再支持闰月选择，视作平月处理
        setIsLeapMonth(false)
        setTempValue((t) => {
          const max = daysInMonth(t.year, item.m)
          const day = Math.min(t.day, max)
          return { ...t, month: item.m, day }
        })
      }
      const offset = (target as HTMLButtonElement).offsetTop - (container.clientHeight - (target as HTMLButtonElement).clientHeight) / 2
      container.scrollTo({ top: offset, behavior: 'smooth' })
    }, 150)
  }
  const onDayScroll = makeScrollHandler<number>(dayRef, days, (v) => v, (v) => setTempValue((t) => ({ ...t, day: v })))
  const onHourScroll = makeScrollHandler<number>(hourRef, hours, (v) => v, (v) => setTempValue((t) => ({ ...t, hour: v })))
  const onMinuteScroll = makeScrollHandler<number>(minuteRef, minutes, (v) => v, (v) => setTempValue((t) => ({ ...t, minute: v })))

  useEffect(() => {
    if (!isOpen) return

    const centerByIndex = (ref: { current: HTMLDivElement | null }, index: number) => {
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

    const findMonthIndex = () => {
    if (mode !== 'lunar') return tempValue.month - 1
    for (let i = 0; i < months.length; i++) {
      const it = months[i]
      if (typeof it === 'number') {
        if (it === tempValue.month) return i
      } else {
        if (it.m === tempValue.month) return i
      }
    }
    return 0
  }

    // 使用 rAF 等待渲染后测量
    const id = requestAnimationFrame(() => {
      centerByIndex(yearRef, Math.max(0, years.indexOf(tempValue.year)))
      centerByIndex(monthRef, Math.max(0, findMonthIndex()))
      centerByIndex(dayRef, Math.max(0, tempValue.day - 1))
      centerByIndex(hourRef, Math.max(0, tempValue.hour))
      centerByIndex(minuteRef, Math.max(0, tempValue.minute))
    })

    return () => cancelAnimationFrame(id)
  }, [isOpen, tempValue, years, months, mode, isLeapMonth])

  useEffect(() => {
    if (!isOpen) return
    // 打开时用当前 value 初始化，确保滚动定位对齐
    setTempValue(value)
  }, [isOpen, value])

  // 当年份变化时，重置闰月标记，避免跨年后闰月索引错位
  useEffect(() => {
    if (mode === 'lunar') setIsLeapMonth(false)
  }, [mode, tempValue.year])

  useEffect(() => {
    const max = daysInMonth(tempValue.year, tempValue.month)
    if (tempValue.day > max) {
      setTempValue((t) => ({ ...t, day: max }))
    }
    // 月份或闰月变化后，将“日”列滚动到当前选择项
    const container = dayRef.current
    if (container) {
      const buttons = container.querySelectorAll<HTMLButtonElement>("button[data-picker-item='true']")
      const idx = Math.max(0, tempValue.day - 1)
      const btn = buttons[idx]
      if (btn) {
        const off = (btn as HTMLButtonElement).offsetTop - (container.clientHeight - (btn as HTMLButtonElement).clientHeight) / 2
        container.scrollTo({ top: off, behavior: 'smooth' })
      }
    }
  }, [tempValue.year, tempValue.month, isLeapMonth, mode])

  const handleConfirm = () => {
    if (mode === 'lunar') {
      // 农历转公历
      try {
        const solarDate = solarFromLunar(tempValue.year, tempValue.month, tempValue.day, isLeapMonth)
        if (solarDate) {
          onChange({
            year: solarDate.getFullYear(),
            month: solarDate.getMonth() + 1,
            day: solarDate.getDate(),
            hour: tempValue.hour,
            minute: tempValue.minute,
          })
        } else {
          throw new Error('convert_failed')
        }
      } catch (e) {
        console.error('农历转换失败', e)
        onChange(tempValue)
      }
    } else {
      onChange(tempValue)
    }
    setIsOpen(false)
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start text-left font-normal bg-background/50 h-12 text-base"
        onClick={() => setIsOpen(true)}
      >
        {(() => {
          if (mode !== 'lunar') {
            return (
              <>
                {value.year}年 {value.month}月 {value.day}日 {String(value.hour).padStart(2, "0")}:{String(value.minute).padStart(2, "0")}
              </>
            )
          }
          try {
            const d = makeDate(value.year, value.month - 1, value.day)
            const lsr = lunisolar(d)
            const lunar: any = (lsr as any).lunar
            const mName = typeof lunar.getMonthName === 'function' ? lunar.getMonthName() : (monthNames[(lunar.month % 100) - 1] || `${lunar.month}月`)
            const dName = typeof lunar.getDayName === 'function' ? lunar.getDayName() : (dayNames[(lunar.day - 1)] || `${lunar.day}日`)
            return (
              <>农历 {toCnYear(lunar.year)}年 {mName} {dName}（{value.year}年 {value.month}月 {value.day}日 {String(value.hour).padStart(2, "0")}:{String(value.minute).padStart(2, "0")}）</>
            )
          } catch {
            return (
              <>农历 {toCnYear(value.year)}年 {value.month}月 {value.day}日 {String(value.hour).padStart(2, "0")}:{String(value.minute).padStart(2, "0")} </>
            )
          }
        })()}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center" onClick={() => setIsOpen(false)}>
          <div className="bg-card w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" size="lg" className="text-base" onClick={() => setIsOpen(false)}>
                取消
              </Button>
              <h3 className="font-semibold text-lg">{mode === 'lunar' ? '选择农历日期时间' : '选择公历日期时间'}</h3>
              <Button variant="ghost" size="lg" className="text-base text-primary" onClick={handleConfirm}>
                确定
              </Button>
            </div>

            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-14 bg-primary/5 border-y-2 border-primary/20 pointer-events-none z-10 rounded-lg" />
              <div className="absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-card to-transparent pointer-events-none z-10" />
              <div className="absolute left-0 right-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />

              <div className="flex gap-1 h-72 overflow-hidden relative">
                {/* Year Picker */}
                <div
                  ref={yearRef}
                  onScroll={onYearScroll}
                  className="flex-1 overflow-y-scroll hide-scrollbar"
                  style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'y proximity', touchAction: 'pan-y', overscrollBehavior: 'contain' as any }}
                >
                  <div className="py-28">
                    {years.map((year) => (
                      <button
                        key={year}
                        type="button"
                        data-picker-item="true"
                        className={`w-full h-14 flex items-center justify-center transition-all duration-200 rounded-lg text-base font-medium ${
                          tempValue.year === year
                            ? "text-foreground scale-110"
                            : "text-muted-foreground/60 hover:text-muted-foreground scale-95"
                        }`}
                        style={{ scrollSnapAlign: 'center' }}
                        onClick={() => setTempValue({ ...tempValue, year })}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Month Picker */}
                <div
                  ref={monthRef}
                  onScroll={onMonthScroll}
                  className="flex-1 overflow-y-scroll hide-scrollbar"
                  style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'y proximity', touchAction: 'pan-y', overscrollBehavior: 'contain' as any }}
                >
                  <div className="py-28">
                    {months.map((item, idx) => {
                      const label = typeof item === 'number' ? `${item}月` : item.label
                      const active = (() => {
                        if (typeof item === 'number') return tempValue.month === item
                        return tempValue.month === item.m && isLeapMonth === item.isLeap
                      })()
                      return (
                        <button
                          key={idx}
                          type="button"
                          data-picker-item="true"
                          className={`w-full h-14 flex items-center justify-center transition-all duration-200 rounded-lg text-base font-medium ${
                            active ? "text-foreground scale-110" : "text-muted-foreground/60 hover:text-muted-foreground scale-95"
                          }`}
                          style={{ scrollSnapAlign: 'center' }}
                          onClick={() => {
                            if (typeof item === 'number') {
                              setTempValue({ ...tempValue, month: item })
                              setIsLeapMonth(false)
                            } else {
                              setTempValue({ ...tempValue, month: item.m })
                              setIsLeapMonth(item.isLeap)
                            }
                          }}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Day Picker */
                /* 农历模式下显示传统日期名 */}
                <div
                  ref={dayRef}
                  onScroll={onDayScroll}
                  className="flex-1 overflow-y-scroll hide-scrollbar"
                  style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'y proximity', touchAction: 'pan-y', overscrollBehavior: 'contain' as any }}
                >
                  <div className="py-28">
                    {days.map((day) => (
                      <button
                        key={day}
                        type="button"
                        data-picker-item="true"
                        className={`w-full h-14 flex items-center justify-center transition-all duration-200 rounded-lg text-base font-medium ${
                          tempValue.day === day
                            ? "text-foreground scale-110"
                            : "text-muted-foreground/60 hover:text-muted-foreground scale-95"
                        }`}
                        style={{ scrollSnapAlign: 'center' }}
                        onClick={() => setTempValue({ ...tempValue, day })}
                      >
                        {mode === 'lunar' ? (dayNames[day-1] || `${day}日`) : `${day}日`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hour Picker */}
                <div
                  ref={hourRef}
                  onScroll={onHourScroll}
                  className="flex-1 overflow-y-scroll hide-scrollbar"
                  style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'y proximity', touchAction: 'pan-y', overscrollBehavior: 'contain' as any }}
                >
                  <div className="py-28">
                    {hours.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        data-picker-item="true"
                        className={`w-full h-14 flex items-center justify-center transition-all duration-200 rounded-lg text-base font-medium ${
                          tempValue.hour === hour
                            ? "text-foreground scale-110"
                            : "text-muted-foreground/60 hover:text-muted-foreground scale-95"
                        }`}
                        style={{ scrollSnapAlign: 'center' }}
                        onClick={() => setTempValue({ ...tempValue, hour })}
                      >
                        {String(hour).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minute Picker */}
                <div
                  ref={minuteRef}
                  onScroll={onMinuteScroll}
                  className="flex-1 overflow-y-scroll hide-scrollbar"
                  style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'y proximity', touchAction: 'pan-y', overscrollBehavior: 'contain' as any }}
                >
                  <div className="py-28">
                    {minutes.map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        data-picker-item="true"
                        className={`w-full h-14 flex items-center justify-center transition-all duration-200 rounded-lg text-base font-medium ${
                          tempValue.minute === minute
                            ? "text-foreground scale-110"
                            : "text-muted-foreground/60 hover:text-muted-foreground scale-95"
                        }`}
                        style={{ scrollSnapAlign: 'center' }}
                        onClick={() => setTempValue({ ...tempValue, minute })}
                      >
                        {String(minute).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
