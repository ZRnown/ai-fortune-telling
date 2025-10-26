import lunisolar from 'lunisolar'

export type Pillar = { stem?: string; branch?: string }
export type PillarsInput = { year: Pillar; month: Pillar; day: Pillar; hour: Pillar }

const YEAR_MIN = 1801
const YEAR_MAX = 2099

function matches(c8: any, input: PillarsInput): boolean {
  const y = c8?.year
  const m = c8?.month
  const d = c8?.day
  const h = c8?.hour
  const get = (p: any) => ({ stem: p?.stem?.name as string, branch: p?.branch?.name as string })
  const Y = get(y)
  const M = get(m)
  const D = get(d)
  const H = get(h)
  const eq = (want: Pillar, got: { stem: string; branch: string }) => {
    if (want.stem && want.stem !== got.stem) return false
    if (want.branch && want.branch !== got.branch) return false
    return true
  }
  return eq(input.year, Y) && eq(input.month, M) && eq(input.day, D) && eq(input.hour, H)
}

export function findDateByPillarsWithRange(
  input: PillarsInput,
  opts?: { yearStart?: number; yearEnd?: number; minuteStep?: number }
): Date | null {
  const yearStart = Math.max(YEAR_MIN, Math.min(YEAR_MAX, opts?.yearStart ?? YEAR_MIN))
  const yearEnd = Math.max(yearStart, Math.min(YEAR_MAX, opts?.yearEnd ?? YEAR_MAX))
  const minuteStep = Math.min(60, Math.max(1, opts?.minuteStep ?? 60))

  for (let y = yearStart; y <= yearEnd; y++) {
    try {
      // quick filter by year gz if both provided
      if (input.year.stem || input.year.branch) {
        const yGz = lunisolar(new Date(y, 0, 1)).format('cY')
        if (input.year.stem && input.year.stem !== yGz[0]) continue
        if (input.year.branch && input.year.branch !== yGz[1]) continue
      }
      for (let month = 1; month <= 12; month++) {
        const daysInMonth = new Date(y, month, 0).getDate()
        for (let day = 1; day <= daysInMonth; day++) {
          for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += minuteStep) {
              const lsr = lunisolar(new Date(y, month - 1, day, hour, minute))
              const c8 = (lsr as any).char8ex?.(1) ?? (lsr as any).char8
              if (!c8) continue
              if (matches(c8, input)) {
                return new Date(y, month - 1, day, hour, minute)
              }
            }
          }
        }
      }
    } catch {}
  }
  return null
}

// 兼容旧API（默认全范围、按整点搜索）
export function findDateByPillars(input: PillarsInput, minute: number = 0): Date | null {
  return findDateByPillarsWithRange(input, { yearStart: YEAR_MIN, yearEnd: YEAR_MAX, minuteStep: 60 })
}
