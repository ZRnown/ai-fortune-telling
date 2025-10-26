import lunisolar from 'lunisolar'
import { takeSound } from '@lunisolar/plugin-takesound'
import { char8ex } from '@lunisolar/plugin-char8ex'

lunisolar.extend(takeSound)
lunisolar.extend(char8ex)

const branchOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const
const lifeStages = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'] as const
const yangStems = new Set(['甲', '丙', '戊', '庚', '壬'])
const lifeStartIndex: Record<string, string> = {
  甲: '亥',
  乙: '午',
  丙: '寅',
  丁: '酉',
  戊: '寅',
  己: '酉',
  庚: '巳',
  辛: '子',
  壬: '申',
  癸: '卯',
}

// 地支主气（简化版）：用于在无藏干列表时兜底地支十神
const BRANCH_MAIN_HS: Record<string, string> = {
  '子': '癸', '丑': '己', '寅': '甲', '卯': '乙', '辰': '戊', '巳': '丙',
  '午': '丁', '未': '己', '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬'
}

// 天干五行与阴阳
const STEM_META: Record<string, { el: '木'|'火'|'土'|'金'|'水'; yang: boolean }> = {
  '甲': { el: '木', yang: true }, '乙': { el: '木', yang: false },
  '丙': { el: '火', yang: true }, '丁': { el: '火', yang: false },
  '戊': { el: '土', yang: true }, '己': { el: '土', yang: false },
  '庚': { el: '金', yang: true }, '辛': { el: '金', yang: false },
  '壬': { el: '水', yang: true }, '癸': { el: '水', yang: false },
}
const GENERATE: Record<'木'|'火'|'土'|'金'|'水', '木'|'火'|'土'|'金'|'水'> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
}
const CONTROL: Record<'木'|'火'|'土'|'金'|'水', '木'|'火'|'土'|'金'|'水'> = {
  '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
}

function computeTenGodOfStem(dayStem: string, otherStem: string): string {
  const a = STEM_META[dayStem]
  const b = STEM_META[otherStem]
  if (!a || !b) return ''
  if (a.el === b.el) return a.yang === b.yang ? '比肩' : '劫财'
  // 我生他 -> 食伤
  if (GENERATE[a.el] === b.el) return a.yang === b.yang ? '食神' : '伤官'
  // 他生我 -> 印
  if (GENERATE[b.el] === a.el) return a.yang === b.yang ? '正印' : '偏印'
  // 我克他 -> 财
  if (CONTROL[a.el] === b.el) return a.yang === b.yang ? '正财' : '偏财'
  // 他克我 -> 官杀
  if (CONTROL[b.el] === a.el) return a.yang === b.yang ? '正官' : '七杀'
  return ''
}

// 60甲子纳音（按 SIXTY_JIAZI 顺序一一对应）
const NAYIN60: string[] = [
  '海中金','海中金','炉中火','炉中火','大林木','大林木','路旁土','路旁土','剑锋金','剑锋金','山头火','山头火',
  '涧下水','涧下水','城头土','城头土','白蜡金','白蜡金','杨柳木','杨柳木','井泉水','井泉水','屋上土','屋上土',
  '霹雳火','霹雳火','松柏木','松柏木','长流水','长流水','砂中金','砂中金','山下火','山下火','平地木','平地木',
  '壁上土','壁上土','金箔金','金箔金','覆灯火','覆灯火','天河水','天河水','大驿土','大驿土','钗钏金','钗钏金',
  '桑柘木','桑柘木','大溪水','大溪水','砂中土','砂中土','天上火','天上火','石榴木','石榴木','大海水','大海水'
]

function nayinOfGanzhi(gz: string): string {
  const idx = SIXTY_JIAZI.indexOf(gz)
  return idx >= 0 ? (NAYIN60[idx] || '') : ''
}

function proxyYearInRangeForGanzhi(year: number): number | null {
  // map to [YEAR_MIN, YEAR_MAX] having same Ganzhi index as target year
  const base = 1984
  const idx = ((year - base) % 60 + 60) % 60
  // try series base + idx +/- 60k to fit range
  for (let k = -5; k <= 5; k++) {
    const y = base + idx + 60 * k
    if (y >= YEAR_MIN && y <= YEAR_MAX) return y
  }
  return null
}

function extractYearInfo(c8Year: any, dayStemChar: string) {
  const hs = safeStr(c8Year?.stem?.name)
  const eb = safeStr(c8Year?.branch?.name)
  const hiddenStems = c8Year?.branch?.hiddenStems ?? []
  const branchTen = (c8Year?.branchTenGod ?? []).map((tg: any) => safeStr(tg?.name))
  const hidden = hiddenStems.map((s: any, idx: number) => ({ char: safeStr(s?.name), tenGod: branchTen[idx] ?? undefined }))
  const nayin = c8Year?.takeSound ?? ''
  const gods = (c8Year?.gods ?? []).map((g: any) => safeStr(g?.name))
  const voidness = (c8Year?.missing ?? c8Year?.branch?.missing ?? []).map((b: any) => safeStr(b?.name)).join('')
  const fortune = getLifeStage(dayStemChar, eb)
  const selfSit = getLifeStage(hs, eb)
  return { hidden, nayin, gods, voidness, fortune, selfSit }
}

const branchIndex = (branch: string) => branchOrder.indexOf(branch as (typeof branchOrder)[number])

const getLifeStage = (stem: string, branch: string) => {
  const startBranch = lifeStartIndex[stem]
  const startIdx = startBranch ? branchIndex(startBranch) : -1
  const branchIdx = branchIndex(branch)
  if (startIdx === -1 || branchIdx === -1) return ''

  if (yangStems.has(stem)) {
    const diff = (branchIdx - startIdx + 12) % 12
    return lifeStages[diff] ?? ''
  }
  const diff = (startIdx - branchIdx + 12) % 12
  return lifeStages[diff] ?? ''
}

export type BaziInput = {
  year: number
  month: number // 1-12
  day: number
  hour: number // 0-23
  minute: number // 0-59
  gender?: 'male' | 'female' | '男' | '女'
}

export type BaziPillar = {
  heavenlyStem: { char: string; tenGod?: string }
  earthlyBranch: { char: string; hidden: { char: string; tenGod?: string }[] }
  nayin?: string
  gods?: string[]
  fortune?: string
  selfSit?: string
  voidness?: string
}

export type DaYunItem = {
  year: number
  age: string
  stem: string
  stemTG: string
  branch: string
  branchTG: string
  startYear: number
  endYear: number
  hidden?: { char: string; tenGod?: string }[]
  fortune?: string
  selfSit?: string
  voidness?: string
  nayin?: string
  gods?: string[]
}

export type LiuNianItem = {
  year: number
  stem: string
  stemTG: string
  branch: string
  branchTG: string
  ganzhi: string
  hidden?: { char: string; tenGod?: string }[]
  fortune?: string
  selfSit?: string
  voidness?: string
  nayin?: string
  gods?: string[]
}

export type BaziResult = {
  solarDate: string
  lunarDate: string
  voidness: string
  pillars: {
    year: BaziPillar
    month: BaziPillar
    day: BaziPillar
    hour: BaziPillar
  }
  elements: { name: string; percent: number }[]
  tenGods: { name: string; percent: number }[]
}

export type CurrentTimeInfo = {
  '当前时间（公历）': string
  '当前时间（农历）': string
  '今日黄历': string
  '其他时间知识'?: Record<string, any>
}

export type BaziDetailedReport = BaziResult & { currentTime: CurrentTimeInfo }

// 六十甲子顺序
const SIXTY_JIAZI = [
  '甲子','乙丑','丙寅','丁卯','戊辰','己巳','庚午','辛未','壬申','癸酉','甲戌','乙亥',
  '丙子','丁丑','戊寅','己卯','庚辰','辛巳','壬午','癸未','甲申','乙酉','丙戌','丁亥',
  '戊子','己丑','庚寅','辛卯','壬辰','癸巳','甲午','乙未','丙申','丁酉','戊戌','己亥',
  '庚子','辛丑','壬寅','癸卯','甲辰','乙巳','丙午','丁未','戊申','己酉','庚戌','辛亥',
  '壬子','癸丑','甲寅','乙卯','丙辰','丁巳','戊午','己未','庚申','辛酉','壬戌','癸亥'
]

// 安全字符串转换，避免对 undefined 调用 toString 导致报错（顶层作用域）
function safeStr(v: any): string {
  try {
    if (v == null) return ''
    if (typeof v === 'string') return v
    if (typeof v === 'number' || typeof v === 'boolean') return String(v)
    if (typeof v?.toString === 'function') return v.toString()
    return ''
  } catch {
    return ''
  }
}

// 计算起运岁数
function calculateQiYunAge(birthDate: Date, yearStem: string, gender: 'male' | 'female'): { age: number; months: number; days: number } {
  try {
    const isYangYear = yangStems.has(yearStem)
    const isYangMale = gender === 'male' && isYangYear
    const isYinFemale = gender === 'female' && !isYangYear
    const forward = isYangMale || isYinFemale

    const lsr = lunisolar(birthDate)
    const recentTermResult = lsr.recentSolarTerm(0) // 最近的节，返回 [SolarTerm, Date]
    const recentTerm = recentTermResult ? recentTermResult[0] : null
    const recentTermDate = recentTermResult ? recentTermResult[1] : null
    
    let targetDate: Date
    if (forward) {
      // 顺推到下一个节
      const nextTermIndex = (recentTerm?.value ?? 0) + 2
      const yearTerms = lunisolar.SolarTerm.getYearTermDayList(birthDate.getFullYear())
      const nextTermDay = yearTerms[nextTermIndex % 24]
      const nextTermMonth = Math.floor((nextTermIndex % 24) / 2) + 1
      targetDate = new Date(birthDate.getFullYear() + (nextTermIndex >= 24 ? 1 : 0), nextTermMonth - 1, nextTermDay)
    } else {
      // 逆推到上一个节
      targetDate = recentTermDate ?? birthDate
    }

    const diffMs = Math.abs(targetDate.getTime() - birthDate.getTime())
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    
    // 3天=1岁，1天=4个月，1时辰=10天
    const years = Math.floor(diffDays / 3)
    const remainDays = diffDays % 3
    const months = Math.floor(remainDays * 4)
    const days = Math.floor((remainDays * 4 % 1) * 30)
    
    return { age: years, months, days }
  } catch {
    // 兜底：若节气计算失败，起运岁数置 0，避免崩溃
    return { age: 0, months: 0, days: 0 }
  }
}

// 安全获取八字字符对象
function safeGetC8(lsr: any, genderNorm: 'male' | 'female') {
  try {
    const code = genderNorm === 'male' ? 1 : 0
    return (lsr as any).char8ex?.(code) ?? (lsr as any).char8 ?? {}
  } catch {
    try { return (lsr as any).char8 ?? {} } catch { return {} }
  }
}

// 计算大运
export function calculateDaYun(input: BaziInput, baziResult: BaziResult, count: number = 10): DaYunItem[] {
  const { year, month, day, hour, minute, gender } = input
  const genderNorm: 'male' | 'female' = gender === 'female' || gender === '女' ? 'female' : 'male'
  const birthDate = new Date(year, month - 1, day, hour, minute)
  
  const yearStem = baziResult.pillars.year.heavenlyStem.char
  const monthGanzhi = baziResult.pillars.month.heavenlyStem.char + baziResult.pillars.month.earthlyBranch.char
  const monthIndex = SIXTY_JIAZI.indexOf(monthGanzhi)
  
  if (monthIndex === -1) return []
  
  const qiyun = calculateQiYunAge(birthDate, yearStem, genderNorm)
  const startAge = qiyun.age
  
  const isYangYear = yangStems.has(yearStem)
  const isYangMale = genderNorm === 'male' && isYangYear
  const isYinFemale = genderNorm === 'female' && !isYangYear
  const forward = isYangMale || isYinFemale
  
  const lsr = lunisolar(birthDate)
  const c8 = safeGetC8(lsr, genderNorm)
  const dayStemChar = safeStr((c8 as any)?.day?.stem?.name)
  
  const result: DaYunItem[] = []
  for (let i = 0; i < count; i++) {
    const offset = forward ? i + 1 : -i - 1
    const gzIndex = (monthIndex + offset + 60) % 60
    const gz = SIXTY_JIAZI[gzIndex]
    const stem = gz[0]
    const branch = gz[1]
    
    const age = startAge + 1 + i * 10
    // 计算使用的真实起运年（用于干支/神煞等一切计算）
    const trueStartYear = year + age
    
    // 创建该大运时间点以获取十神（范围外走兜底）
    let stemTG = ''
    let branchTG = ''
    let extra: { hidden?: {char:string;tenGod?:string}[]; nayin?: string; gods?: string[]; voidness?: string; fortune?: string; selfSit?: string } = {}
    if (trueStartYear < 1900 || trueStartYear > 2100) {
      // 兜底：不调用 lunisolar，直接用主气/推断计算
      const mainHs = BRANCH_MAIN_HS[branch] || ''
      stemTG = computeTenGodOfStem(dayStemChar, stem)
      branchTG = mainHs ? computeTenGodOfStem(dayStemChar, mainHs) : ''
      const proxy = proxyYearInRangeForGanzhi(trueStartYear)
      if (proxy) {
        try {
          const p = lunisolar(new Date(proxy, month - 1, day))
          const c8p = safeGetC8(p, genderNorm)
          const ex = extractYearInfo(c8p?.year, dayStemChar)
          extra = { ...ex, fortune: getLifeStage(dayStemChar, branch), selfSit: getLifeStage(stem, branch) }
        } catch {
          extra = {
            hidden: mainHs ? [{ char: mainHs, tenGod: computeTenGodOfStem(dayStemChar, mainHs) }] : [],
            nayin: nayinOfGanzhi(stem + branch),
            gods: [],
            voidness: '',
            fortune: getLifeStage(dayStemChar, branch),
            selfSit: getLifeStage(stem, branch),
          }
        }
      } else {
        extra = {
          hidden: mainHs ? [{ char: mainHs, tenGod: computeTenGodOfStem(dayStemChar, mainHs) }] : [],
          nayin: nayinOfGanzhi(stem + branch),
          gods: [],
          voidness: '',
          fortune: getLifeStage(dayStemChar, branch),
          selfSit: getLifeStage(stem, branch),
        }
      }
    } else {
      try {
        const dyLsr = lunisolar(new Date(trueStartYear, month - 1, day))
        const dyC8 = safeGetC8(dyLsr, genderNorm)
        stemTG = safeStr(dyC8?.year?.stemTenGod?.name)
        const branchTGFromYear = safeStr(dyC8?.year?.branchTenGod?.[0]?.name)
        extra = extractYearInfo(dyC8?.year, dayStemChar)
        // 对齐到大运本身的干支口径：十二长生用大运支，自坐用大运干+支；纳音缺失则按大运干支补齐
        extra = {
          ...extra,
          fortune: getLifeStage(dayStemChar, branch),
          selfSit: getLifeStage(stem, branch),
          nayin: extra.nayin ?? nayinOfGanzhi(stem + branch),
        }
        const mainHs = BRANCH_MAIN_HS[branch] || safeStr(extra.hidden?.[0]?.char)
        if (!extra.hidden || extra.hidden.length === 0) {
          extra.hidden = mainHs ? [{ char: mainHs, tenGod: computeTenGodOfStem(dayStemChar, mainHs) }] : []
        }
        branchTG = branchTGFromYear || safeStr(extra.hidden?.[0]?.tenGod) || computeTenGodOfStem(dayStemChar, mainHs)
        if (!stemTG) stemTG = computeTenGodOfStem(dayStemChar, stem)
      } catch {
        const mainHs = BRANCH_MAIN_HS[branch] || ''
        stemTG = computeTenGodOfStem(dayStemChar, stem)
        branchTG = mainHs ? computeTenGodOfStem(dayStemChar, mainHs) : ''
        const proxy = proxyYearInRangeForGanzhi(trueStartYear)
        if (proxy) {
          try {
            const p = lunisolar(new Date(proxy, month - 1, day))
            const c8p = safeGetC8(p, genderNorm)
            const ex = extractYearInfo(c8p?.year, dayStemChar)
            extra = { ...ex, fortune: getLifeStage(dayStemChar, branch), selfSit: getLifeStage(stem, branch) }
          } catch {
            extra = {
              hidden: mainHs ? [{ char: mainHs, tenGod: computeTenGodOfStem(dayStemChar, mainHs) }] : [],
              nayin: nayinOfGanzhi(stem + branch),
              gods: [],
              voidness: '',
              fortune: getLifeStage(dayStemChar, branch),
              selfSit: getLifeStage(stem, branch),
            }
          }
        } else {
          extra = {
            hidden: mainHs ? [{ char: mainHs, tenGod: computeTenGodOfStem(dayStemChar, mainHs) }] : [],
            nayin: nayinOfGanzhi(stem + branch),
            gods: [],
            voidness: '',
            fortune: getLifeStage(dayStemChar, branch),
            selfSit: getLifeStage(stem, branch),
          }
        }
      }
    }
    
    // 按规则：显示年份 = 真实年份 - 1；年龄不变；干支/十神不变
    const displayStartYear = trueStartYear - 1
    result.push({
      year: displayStartYear,
      age: `${age}岁`,
      stem,
      stemTG,
      branch,
      branchTG,
      startYear: displayStartYear,
      endYear: displayStartYear + 9,
      hidden: extra.hidden ?? [],
      fortune: extra.fortune ?? '',
      selfSit: extra.selfSit ?? '',
      voidness: extra.voidness ?? '',
      nayin: extra.nayin ?? nayinOfGanzhi(stem + branch),
      gods: extra.gods ?? []
    })
  }
  
  return result
}

// 计算流年
const YEAR_MIN = 1900
const YEAR_MAX = 2100

function ganzhiOfYear(year: number): string {
  // 1984年为甲子
  const base = 1984
  const idx = ((year - base) % 60 + 60) % 60
  return SIXTY_JIAZI[idx]
}

export function calculateLiuNian(birthYear: number, currentYear: number, count: number = 10, dayStemForTG?: string): LiuNianItem[] {
  const result: LiuNianItem[] = []
  
  for (let i = 0; i < count; i++) {
    // 显示年份（按需求减1规则：这里的 currentYear 传入即为显示起点）
    const displayYear = currentYear + i
    // 真实用于干支计算的年份（显示+1，保证干支不变）
    const trueYear = displayYear + 1
    if (trueYear < YEAR_MIN || trueYear > YEAR_MAX) {
      const gz = ganzhiOfYear(trueYear)
      const stem = gz[0]
      const branch = gz[1]
      const lnDayStem = dayStemForTG || ''
      const stemTG = lnDayStem ? computeTenGodOfStem(lnDayStem, stem) : ''
      const mainHs = BRANCH_MAIN_HS[branch] || ''
      const branchTG = lnDayStem && mainHs ? computeTenGodOfStem(lnDayStem, mainHs) : ''
      const proxy = proxyYearInRangeForGanzhi(trueYear)
      if (proxy) {
        try {
          const p = lunisolar(new Date(proxy, 0, 1))
          const c8p = safeGetC8(p, 'male')
          const ex = extractYearInfo(c8p?.year, lnDayStem)
          result.push({
            year: displayYear,
            stem,
            stemTG,
            branch,
            branchTG,
            ganzhi: gz,
            hidden: ex.hidden,
            fortune: lnDayStem ? getLifeStage(lnDayStem, branch) : '',
            selfSit: getLifeStage(stem, branch),
            voidness: ex.voidness,
            nayin: ex.nayin || nayinOfGanzhi(gz),
            gods: ex.gods
          })
        } catch {
          result.push({
            year: displayYear,
            stem,
            stemTG,
            branch,
            branchTG,
            ganzhi: gz,
            hidden: mainHs ? [{ char: mainHs, tenGod: lnDayStem ? computeTenGodOfStem(lnDayStem, mainHs) : undefined }] : [],
            fortune: lnDayStem ? getLifeStage(lnDayStem, branch) : '',
            selfSit: getLifeStage(stem, branch),
            voidness: '',
            nayin: nayinOfGanzhi(gz),
            gods: []
          })
        }
      } else {
        result.push({
          year: displayYear,
          stem,
          stemTG,
          branch,
          branchTG,
          ganzhi: gz,
          hidden: mainHs ? [{ char: mainHs, tenGod: lnDayStem ? computeTenGodOfStem(lnDayStem, mainHs) : undefined }] : [],
          fortune: lnDayStem ? getLifeStage(lnDayStem, branch) : '',
          selfSit: getLifeStage(stem, branch),
          voidness: '',
          nayin: nayinOfGanzhi(gz),
          gods: []
        })
      }
    } else {
      try {
        const lsr = lunisolar(new Date(trueYear, 0, 1))
        const yearGanzhi = lsr.format('cY')
        const stem = yearGanzhi[0]
        const branch = yearGanzhi[1]

        // 使用lunisolar获取该年的八字以计算十神
        const c8 = safeGetC8(lsr, 'male')
        let stemTG = safeStr(c8?.year?.stemTenGod?.name)
        let branchTG = safeStr(c8?.year?.branchTenGod?.[0]?.name)
        const lnDayStem = safeStr((c8 as any)?.day?.stem?.name) || dayStemForTG || ''
        const extra = extractYearInfo(c8?.year, lnDayStem)
        if (!stemTG && lnDayStem) stemTG = computeTenGodOfStem(lnDayStem, stem)
        const mainHs = BRANCH_MAIN_HS[branch] || safeStr(extra.hidden?.[0]?.char)
        if (!branchTG && lnDayStem) {
          branchTG = mainHs ? computeTenGodOfStem(lnDayStem, mainHs) : ''
        }
        const ensuredHidden = (extra.hidden && extra.hidden.length > 0) ? extra.hidden : (mainHs ? [{ char: mainHs, tenGod: lnDayStem ? computeTenGodOfStem(lnDayStem, mainHs) : undefined }] : [])

        result.push({
          year: displayYear,
          stem,
          stemTG,
          branch,
          branchTG,
          ganzhi: yearGanzhi,
          hidden: ensuredHidden,
          fortune: extra.fortune,
          selfSit: extra.selfSit,
          voidness: extra.voidness,
          nayin: extra.nayin ?? nayinOfGanzhi(yearGanzhi),
          gods: extra.gods ?? []
        })
      } catch {
        // fallback to cycle computation if lunisolar fails unexpectedly in-range
        const gz = ganzhiOfYear(trueYear)
        const stem = gz[0]
        const branch = gz[1]
        const lnDayStem = dayStemForTG || ''
        const stemTG = lnDayStem ? computeTenGodOfStem(lnDayStem, stem) : ''
        const mainHs = BRANCH_MAIN_HS[branch] || ''
        const branchTG = lnDayStem && mainHs ? computeTenGodOfStem(lnDayStem, mainHs) : ''
        const proxy = proxyYearInRangeForGanzhi(trueYear)
        if (proxy) {
          try {
            const p = lunisolar(new Date(proxy, 0, 1))
            const c8p = safeGetC8(p, 'male')
            const ex = extractYearInfo(c8p?.year, lnDayStem)
            result.push({
              year: displayYear,
              stem,
              stemTG,
              branch,
              branchTG,
              ganzhi: gz,
              hidden: ex.hidden,
              fortune: lnDayStem ? getLifeStage(lnDayStem, branch) : '',
              selfSit: getLifeStage(stem, branch),
              voidness: ex.voidness,
              nayin: ex.nayin || nayinOfGanzhi(gz),
              gods: ex.gods
            })
          } catch {
            result.push({
              year: displayYear,
              stem,
              stemTG,
              branch,
              branchTG,
              ganzhi: gz,
              hidden: mainHs ? [{ char: mainHs, tenGod: lnDayStem ? computeTenGodOfStem(lnDayStem, mainHs) : undefined }] : [],
              fortune: lnDayStem ? getLifeStage(lnDayStem, branch) : '',
              selfSit: getLifeStage(stem, branch),
              voidness: '',
              nayin: nayinOfGanzhi(gz),
              gods: []
            })
          }
        } else {
          result.push({
            year: displayYear,
            stem,
            stemTG,
            branch,
            branchTG,
            ganzhi: gz,
            hidden: mainHs ? [{ char: mainHs, tenGod: lnDayStem ? computeTenGodOfStem(lnDayStem, mainHs) : undefined }] : [],
            fortune: lnDayStem ? getLifeStage(lnDayStem, branch) : '',
            selfSit: getLifeStage(stem, branch),
            voidness: '',
            nayin: nayinOfGanzhi(gz),
            gods: []
          })
        }
      }
    }
  }
  
  return result
}

export function computeBazi(input: BaziInput): BaziResult {
  const { year, month, day, hour, minute, gender } = input
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  const hh = String(hour).padStart(2, '0')
  const mi = String(minute).padStart(2, '0')
  const lsr = lunisolar(`${year}-${mm}-${dd} ${hh}:${mi}`)

  const genderCode = gender === 'female' || gender === '女' ? 0 : 1
  const c8WithPlugin = (lsr as any).char8ex?.(genderCode)
  const c8 = c8WithPlugin ?? lsr.char8

  const pillarOf = (pillar: any): BaziPillar => {
    const hs = safeStr(pillar?.stem?.name)
    const eb = safeStr(pillar?.branch?.name)
    const hiddenStems = pillar?.branch?.hiddenStems ?? []
    const branchTen = pillar?.branchTenGod ? pillar.branchTenGod.map((tg: any) => safeStr(tg?.name)) : []
    const hidden = hiddenStems.map((s: any, idx: number) => ({
      char: safeStr(s?.name),
      tenGod: branchTen[idx] ?? undefined,
    }))
    const nayin = pillar?.takeSound ?? ''
    const stemTenGod = safeStr(pillar?.stemTenGod?.name) || undefined
    const gods = (pillar?.gods ?? []).map((g: any) => safeStr(g?.name))
    const missing = (pillar?.missing ?? pillar?.branch?.missing ?? []).map((b: any) => safeStr(b?.name)).join('')
    return {
      heavenlyStem: { char: hs, tenGod: stemTenGod },
      earthlyBranch: { char: eb, hidden },
      nayin,
      gods,
      voidness: missing,
    }
  }

  const yearP = pillarOf(c8.year)
  const monthP = pillarOf(c8.month)
  const dayP = pillarOf(c8.day)
  const hourP = pillarOf(c8.hour)

  // 十二长生（星运）基于日干
  const dayStemChar = dayP.heavenlyStem.char
  const computeStage = (pillar: BaziPillar) => getLifeStage(dayStemChar, pillar.earthlyBranch.char)
  yearP.fortune = computeStage(yearP)
  monthP.fortune = computeStage(monthP)
  dayP.fortune = computeStage(dayP)
  hourP.fortune = computeStage(hourP)

  const computeSelfSit = (pillar: BaziPillar) => getLifeStage(pillar.heavenlyStem.char, pillar.earthlyBranch.char)
  yearP.selfSit = computeSelfSit(yearP)
  monthP.selfSit = computeSelfSit(monthP)
  dayP.selfSit = computeSelfSit(dayP)
  hourP.selfSit = computeSelfSit(hourP)

  // 格式化
  const solarDate = lsr.format('YYYY-MM-DD HH:mm:ss')
  const lunarDate = lsr.format('lY年 lM lD HH:mm')

  return {
    solarDate,
    lunarDate,
    voidness: dayP.voidness ?? '',
    pillars: {
      year: yearP,
      month: monthP,
      day: dayP,
      hour: hourP,
    },
    elements: (() => {
      const stemToElement: Record<string, '木'|'火'|'土'|'金'|'水'> = {
        '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水',
      }
      const buckets: Record<string, number> = { '木':0,'火':0,'土':0,'金':0,'水':0 }
      let total = 0

      // 天干各1权重
      const stems = [yearP.heavenlyStem.char, monthP.heavenlyStem.char, dayP.heavenlyStem.char, hourP.heavenlyStem.char]
      for (const s of stems) {
        const el = stemToElement[s]
        if (el) { buckets[el] += 1; total += 1 }
      }

      // 每柱藏干平均分配1权重
      const branches = [yearP.earthlyBranch, monthP.earthlyBranch, dayP.earthlyBranch, hourP.earthlyBranch]
      for (const br of branches) {
        const hs = br.hidden ?? []
        const n = hs.length || 1
        const w = 1 / n
        for (const h of hs) {
          const el = stemToElement[h.char]
          if (el) { buckets[el] += w; total += 0 } // total 在此不累计，已按每柱=1固定
        }
        total += 1
      }

      const out = Object.entries(buckets).map(([name, v]) => ({ name, percent: total ? Math.round(v/total*1000)/10 : 0 }))
      return out
    })(),
    tenGods: (() => {
      const buckets: Record<string, number> = {}
      let total = 0

      // 天干十神：各1权重
      const stemTG = [yearP.heavenlyStem.tenGod, monthP.heavenlyStem.tenGod, dayP.heavenlyStem.tenGod, hourP.heavenlyStem.tenGod]
      for (const n of stemTG) {
        if (!n) continue
        buckets[n] = (buckets[n] ?? 0) + 1
        total += 1
      }

      // 藏干十神：每柱平均1权重
      const branches = [yearP.earthlyBranch, monthP.earthlyBranch, dayP.earthlyBranch, hourP.earthlyBranch]
      for (const br of branches) {
        const hs = br.hidden ?? []
        const n = hs.length || 1
        const w = 1 / n
        for (const h of hs) {
          const n2 = h.tenGod
          if (!n2) continue
          buckets[n2] = (buckets[n2] ?? 0) + w
        }
        total += 1
      }

      const out = Object.entries(buckets).map(([name, v]) => ({ name, percent: total ? Math.round(v/total*1000)/10 : 0 }))
      // 排序：降序
      out.sort((a,b) => b.percent - a.percent)
      return out
    })(),
  }
}
