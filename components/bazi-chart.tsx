"use client"

import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { flushSync } from 'react-dom'
import { useIsMobile } from "@/hooks/use-mobile"
import { Eye, EyeOff, ChevronDown, ChevronUp, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { BaziResult, BaziInput, DaYunItem, LiuNianItem } from "@/lib/bazi"
import { buildBaziInstruction } from "@/lib/bazi-instruction"
import { calculateDaYun, calculateLiuNian } from "@/lib/bazi"

export function BaziChart({
  result,
  name,
  gender,
  onSendInstruction,
  compact,
  birthInfo,
}: {
  result: BaziResult
  name?: string
  gender?: string
  onSendInstruction?: (instruction: string) => Promise<void> | void
  compact?: boolean
  birthInfo?: BaziInput
}) {
  const isMobile = useIsMobile()
  const baziData = {
    name: name ?? "",
    gender: gender ?? "",
    solarDate: result.solarDate,
    lunarDate: result.lunarDate,
    trueSolarDate: result.solarDate,
  }

  const pillars = [
    {
      label: "年柱",
      heavenlyStem: { char: result.pillars.year.heavenlyStem.char, tenGod: result.pillars.year.heavenlyStem.tenGod },
      earthlyBranch: {
        char: result.pillars.year.earthlyBranch.char,
        hidden: result.pillars.year.earthlyBranch.hidden,
      },
      nayin: result.pillars.year.nayin ?? "",
      fortune: result.pillars.year.fortune ?? "",
      selfSit: result.pillars.year.selfSit ?? "",
      voidness: result.pillars.year.voidness ?? "",
      spirits: result.pillars.year.gods ?? [],
    },
    {
      label: "月柱",
      heavenlyStem: { char: result.pillars.month.heavenlyStem.char, tenGod: result.pillars.month.heavenlyStem.tenGod },
      earthlyBranch: {
        char: result.pillars.month.earthlyBranch.char,
        hidden: result.pillars.month.earthlyBranch.hidden,
      },
      nayin: result.pillars.month.nayin ?? "",
      fortune: result.pillars.month.fortune ?? "",
      selfSit: result.pillars.month.selfSit ?? "",
      voidness: result.pillars.month.voidness ?? "",
      spirits: result.pillars.month.gods ?? [],
    },
    {
      label: "日柱",
      heavenlyStem: { char: result.pillars.day.heavenlyStem.char, tenGod: result.pillars.day.heavenlyStem.tenGod },
      earthlyBranch: {
        char: result.pillars.day.earthlyBranch.char,
        hidden: result.pillars.day.earthlyBranch.hidden,
      },
      nayin: result.pillars.day.nayin ?? "",
      fortune: result.pillars.day.fortune ?? "",
      selfSit: result.pillars.day.selfSit ?? "",
      voidness: result.pillars.day.voidness ?? "",
      spirits: result.pillars.day.gods ?? [],
    },
    {
      label: "时柱",
      heavenlyStem: { char: result.pillars.hour.heavenlyStem.char, tenGod: result.pillars.hour.heavenlyStem.tenGod },
      earthlyBranch: {
        char: result.pillars.hour.earthlyBranch.char,
        hidden: result.pillars.hour.earthlyBranch.hidden,
      },
      nayin: result.pillars.hour.nayin ?? "",
      fortune: result.pillars.hour.fortune ?? "",
      selfSit: result.pillars.hour.selfSit ?? "",
      voidness: result.pillars.hour.voidness ?? "",
      spirits: result.pillars.hour.gods ?? [],
    },
  ]

  const geju = {
    main: "正财格",
    status: "格局完美",
    pattern: "财旺生官",
    description: "财旺生官，财官双美。富贵双全，能以财富换取崇高地位，是顶级的富贵之格。",
    others: [
      "天元坐煞",
      "天元坐财",
      "日禄归时",
      "福德秀气",
      "青龙伏形",
      "天地德合",
      "君臣庆会",
      "五行正印",
      "四时乘旺",
      "重荫重官",
      "金神格",
    ],
  }

  const wuxing = result.elements.map((e) => ({ name: e.name, percent: e.percent, color: e.name === '木' ? 'bg-green-600' : e.name === '火' ? 'bg-red-600' : e.name === '土' ? 'bg-amber-700' : e.name === '金' ? 'bg-yellow-600' : 'bg-blue-600' }))

  const shishen = result.tenGods

  // 五行颜色映射
  const stemElement: Record<string, "木" | "火" | "土" | "金" | "水"> = {
    甲: "木",
    乙: "木",
    丙: "火",
    丁: "火",
    戊: "土",
    己: "土",
    庚: "金",
    辛: "金",
    壬: "水",
    癸: "水",
  }
  const branchElement: Record<string, "木" | "火" | "土" | "金" | "水"> = {
    子: "水",
    丑: "土",
    寅: "木",
    卯: "木",
    辰: "土",
    巳: "火",
    午: "火",
    未: "土",
    申: "金",
    酉: "金",
    戌: "土",
    亥: "水",
  }
  const elementColor = (el: "木" | "火" | "土" | "金" | "水") => {
    switch (el) {
      case "木":
        return "text-green-600"
      case "火":
        return "text-red-600"
      case "土":
        return "text-amber-700"
      case "金":
        return "text-yellow-600"
      case "水":
        return "text-blue-600"
    }
  }

  const colorifyStem = (char: string) => elementColor(stemElement[char] ?? "木")
  const colorifyBranch = (char: string) => elementColor(branchElement[char] ?? "土")

  const abbrTenGod = (s?: string) => {
    const n = (s || '').replace(/\s/g, '')
    if (!n) return ''
    const map: Record<string, string> = {
      '正官': '官', '七杀': '杀', '偏官': '杀', '七殺': '杀',
      '正财': '财', '偏财': '才', '偏才': '才', '正財': '财', '偏財': '才',
      '食神': '食', '伤官': '伤', '傷官': '伤',
      '正印': '印', '偏印': '枭', '枭神': '枭', '梟神': '枭',
      '比肩': '比', '劫财': '劫', '劫財': '劫',
    }
    return map[n] ?? n[0] ?? ''
  }

  // 真实大运和流年计算
  const realDaYun = useMemo(() => {
    if (!birthInfo) return []
    return calculateDaYun(birthInfo, result, 12)
  }, [birthInfo, result])

  const currentYear = new Date().getFullYear()
  const realLiuNian = useMemo(() => {
    if (!birthInfo) return []
    return calculateLiuNian(birthInfo.year, currentYear, 12)
  }, [birthInfo, currentYear])

  // 提前计算 paddedDaYun 供后续 hooks 使用
  const paddedDaYun = realDaYun.length > 0 ? realDaYun : []

  // NOTE: moved liuNianOfSelected / xiaoYun hooks below after selectedDaYun declaration

  // 流月mock数据（暂时保留，后续可实现真实计算）
  const mockLiuYueItems = [
    { name: '立春', date: '2/4', stem: '丙', stemTG: '才', branch: '寅', branchTG: '食' },
    { name: '惊蛰', date: '3/6', stem: '丁', stemTG: '财', branch: '卯', branchTG: '伤' },
    { name: '清明', date: '4/5', stem: '戊', stemTG: '杀', branch: '辰', branchTG: '杀' },
    { name: '立夏', date: '5/5', stem: '己', stemTG: '官', branch: '巳', branchTG: '才' },
    { name: '小满', date: '5/20', stem: '庚', stemTG: '枭', branch: '午', branchTG: '财' },
    { name: '夏至', date: '6/21', stem: '辛', stemTG: '印', branch: '未', branchTG: '官' },
    { name: '大暑', date: '7/23', stem: '壬', stemTG: '比', branch: '申', branchTG: '枭' },
    { name: '立秋', date: '8/7', stem: '癸', stemTG: '劫', branch: '酉', branchTG: '印' },
    { name: '白露', date: '9/8', stem: '甲', stemTG: '食', branch: '戌', branchTG: '杀' },
    { name: '寒露', date: '10/8', stem: '乙', stemTG: '伤', branch: '亥', branchTG: '比' },
    { name: '立冬', date: '11/7', stem: '丙', stemTG: '才', branch: '子', branchTG: '劫' },
    { name: '大雪', date: '12/7', stem: '丁', stemTG: '财', branch: '丑', branchTG: '官' },
  ]

  // paddedLiuNian defined after liuNianOfSelected later
  const paddedLiuYue = mockLiuYueItems

  // 命理指令生成与复制/同步
  const { instruction } = useMemo(() => buildBaziInstruction(result, { gender }), [result, gender])
  const [copied, setCopied] = useState(false)
  const [copiedPro, setCopiedPro] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(instruction)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const handleSync = async () => {
    if (!onSendInstruction) return
    try {
      setSyncing(true)
      await onSendInstruction(instruction)
    } finally {
      setSyncing(false)
    }
  }

  const buildProInstruction = (): string => {
    try {
      const dayStem = result.pillars.day.heavenlyStem.char
      const birthYear = (() => {
        const m = /^(\d{4})-/.exec(result.solarDate || '')
        return m ? parseInt(m[1], 10) : new Date(result.solarDate).getFullYear()
      })()
      const now = new Date()
      const nowLocal = now.toLocaleString('zh-CN', { hour12: false })
      const nowISO = now.toISOString()
      const nowYear = now.getFullYear()
      const allDaYunRaw = (realDaYun || [])
      const allDaYunFiltered = allDaYunRaw.filter(dy => {
        const ageNum = parseInt(String(dy.age).replace(/[^\d]/g, ''), 10)
        return isFinite(ageNum) ? ageNum <= 90 : true
      })
      const allDaYunCn = allDaYunFiltered.map(dy => ({
        "年份": dy.year,
        "年龄": dy.age,
        "天干": dy.stem,
        "天干十神": dy.stemTG,
        "地支": dy.branch,
        "地支十神": dy.branchTG,
        "起运年": dy.startYear,
        "止运年": dy.endYear,
        "藏干": (dy.hidden || []).map(h => ({ "字": h.char, "十神": h.tenGod })),
        "星运": dy.fortune,
        "自坐": dy.selfSit,
        "空亡": dy.voidness,
        "纳音": dy.nayin,
        "神煞": dy.gods
      }))
      // 仅生成“当前起的未来三个大运”的所有流年
      const liuNianByDaYunCn: Record<string, any[]> = {}
      const startIdx = (() => {
        const cur = allDaYunFiltered.findIndex(dy => nowYear >= (dy.startYear as number) && nowYear <= (dy.endYear as number))
        if (cur >= 0) return cur
        const nxt = allDaYunFiltered.findIndex(dy => (dy.startYear as number) >= nowYear)
        return Math.max(0, nxt)
      })()
      const dyTargets = allDaYunFiltered.slice(startIdx, startIdx + 3)
      for (const dy of dyTargets) {
        const liuFull = calculateLiuNian(dy.startYear, dy.startYear, 10, dayStem)
        const liu = liuFull
          .filter(ln => (typeof birthYear === 'number' && isFinite(birthYear)) ? (ln.year - birthYear) <= 90 : true)
          .map(ln => ({
          "年份": ln.year,
          "干支": ln.ganzhi,
          "天干": ln.stem,
          "天干十神": ln.stemTG,
          "地支": ln.branch,
          "地支十神": ln.branchTG,
          "藏干": (ln.hidden || []).map(h => ({ "字": h.char, "十神": h.tenGod })),
          "星运": ln.fortune,
          "自坐": ln.selfSit,
          "空亡": ln.voidness,
          "纳音": ln.nayin,
          "神煞": ln.gods
        }))
        liuNianByDaYunCn[`${dy.startYear}-${dy.endYear}`] = liu
      }
      const userReport = {
        "公历（真太阳时）": result.solarDate,
        "农历": result.lunarDate,
        "性别": (gender === '女' || gender === 'female') ? '女' : '男',
        "出生地点": "",
        "八字": `${result.pillars.year.heavenlyStem.char}${result.pillars.year.earthlyBranch.char} ${result.pillars.month.heavenlyStem.char}${result.pillars.month.earthlyBranch.char} ${result.pillars.day.heavenlyStem.char}${result.pillars.day.earthlyBranch.char} ${result.pillars.hour.heavenlyStem.char}${result.pillars.hour.earthlyBranch.char}`,
        "日主": result.pillars.day.heavenlyStem.char,
        "当前时间(本地)": nowLocal,
        "当前时间(ISO)": nowISO,
      }
      const rulesCn = "你是资深命理师，熟读穷通宝鉴、滴天髓、易经、渊海子平、三命通会、子平真诠、千里命稿、五行精纪、神峰通考。严格按中国传统命理规则，擅长根据古老的中国命理文献和个人的八字报告解读我的<用户的八字报告>。说直白一点，不用太在意用户的看法。以用户八字为唯一依据进行严谨分析与解读；遵守五行生克与十神生克、用神相神喜忌、刑冲合会等基础原则；请先回顾与核验过往已发生之事（前事回顾），再展开系统论断；输出需围绕八字基本信息与构成、基本分析、命理详细分析（含个性、事业、财运、婚姻、健康）、未来一年与三至五年趋势、流年预测（一并结合前事验证）、一生命运、可能劫难与福报及综合建议等部分，逐条充分论证且不少于要求篇幅。## 规则Rules### 精确信息- 确保准确性，使用正确的信息进行回应用户的问题，切勿使用虚假的生日或其他信息。- 请时刻记得基础命理规则中的规则，请时刻记得五行生克的关系。生(土生金，金生水，水生木，木生火，火生土)。克(土克水，水克火，火克金，金克木，木克土)。## 基础命理规则- 五行生克：生(土生金，金生水，水生木，木生火，火生土)。克(土克水，水克火，火克金，金克木，木克土)。- 天干生克关系：生 甲木/乙木生丙火/丁火，丙火/丁火生戊土/己土，戊土/己土生庚金/辛金，庚金/辛金生壬水/癸水，壬水/癸水生甲木/乙木。克 甲木/乙木克戊土/己土，丙火/丁火克庚金/辛金，戊土/己土克壬水/癸水，庚金/辛金克甲木/乙木，壬水/癸水克丙火/丁火。- 十神简称/别称：正官=官，七杀=杀/偏官，正印=印，偏印=枭，比肩=比，劫财=劫，食神=食，伤官=伤，正财=财，偏财=才。- 十神生克: 生 印生比劫，比劫生食伤，食伤生财，财生官杀，官杀生印。克 印克食伤，食伤克官杀，财克(破)印，官杀克比劫，比劫克(夺)财。- 透出指的是天干有某个五行或十神，如果地支有某个五行或十神，一般叫藏或得地。- 用神：定格局的十神。相神：辅佐用神提升格局档次。喜神(喜用神)：辅助相/用神。忌神(忌用神)：破坏相/用神。- 四柱时间对应：年1-16，月17-32，日33-48，时48+。- 刑冲合会会显著影响五行平衡。## 工作流程Workflow0. 分析理解<用户八字报告>。1. 收到用户的提问。2. 分析用户的问题，判断用户的目标和期望。3. 结合专业命理知识以及<用户八字报告>为用户答疑。## 初始化Initialization作为角色<算命大师>，严格遵守以上规则，使用简体中文交流，依据<用户八字报告>精准分析。"
      const payloadCn = {
        "用户八字报告": userReport,
        "四柱": {
          "年": {
            "天干": { "字": result.pillars.year.heavenlyStem.char, "十神": result.pillars.year.heavenlyStem.tenGod },
            "地支": result.pillars.year.earthlyBranch.char,
            "藏干": result.pillars.year.earthlyBranch.hidden.map(h => ({ "字": h.char, "十神": h.tenGod })),
            "纳音": result.pillars.year.nayin,
            "神煞": result.pillars.year.gods,
            "空亡": result.pillars.year.voidness,
            "星运": result.pillars.year.fortune,
            "自坐": result.pillars.year.selfSit,
          },
          "月": {
            "天干": { "字": result.pillars.month.heavenlyStem.char, "十神": result.pillars.month.heavenlyStem.tenGod },
            "地支": result.pillars.month.earthlyBranch.char,
            "藏干": result.pillars.month.earthlyBranch.hidden.map(h => ({ "字": h.char, "十神": h.tenGod })),
            "纳音": result.pillars.month.nayin,
            "神煞": result.pillars.month.gods,
            "空亡": result.pillars.month.voidness,
            "星运": result.pillars.month.fortune,
            "自坐": result.pillars.month.selfSit,
          },
          "日": {
            "天干": { "字": result.pillars.day.heavenlyStem.char, "十神": result.pillars.day.heavenlyStem.tenGod },
            "地支": result.pillars.day.earthlyBranch.char,
            "藏干": result.pillars.day.earthlyBranch.hidden.map(h => ({ "字": h.char, "十神": h.tenGod })),
            "纳音": result.pillars.day.nayin,
            "神煞": result.pillars.day.gods,
            "空亡": result.pillars.day.voidness,
            "星运": result.pillars.day.fortune,
            "自坐": result.pillars.day.selfSit,
          },
          "时": {
            "天干": { "字": result.pillars.hour.heavenlyStem.char, "十神": result.pillars.hour.heavenlyStem.tenGod },
            "地支": result.pillars.hour.earthlyBranch.char,
            "藏干": result.pillars.hour.earthlyBranch.hidden.map(h => ({ "字": h.char, "十神": h.tenGod })),
            "纳音": result.pillars.hour.nayin,
            "神煞": result.pillars.hour.gods,
            "空亡": result.pillars.hour.voidness,
            "星运": result.pillars.hour.fortune,
            "自坐": result.pillars.hour.selfSit,
          },
        },
        "大运": allDaYunCn,
        "流年": liuNianByDaYunCn,
      }
      return `${rulesCn} 数据 ${JSON.stringify(payloadCn)}`
    } catch {
      return instruction
    }
  }

  const handleCopyPro = async () => {
    try {
      const pro = buildProInstruction()
      await navigator.clipboard.writeText(pro)
      setCopiedPro(true)
      setTimeout(() => setCopiedPro(false), 1500)
    } catch {}
  }

  // 指令变更时自动向上汇报，便于对话区随时持有最新指令
  useEffect(() => {
    onSendInstruction?.(instruction)
  }, [instruction])

  // 调候与用神（简化口径）
  const monthBranch = pillars[1].earthlyBranch.char
  const coldMonths = new Set(['亥','子','丑'])
  const hotMonths = new Set(['巳','午','未'])
  const water = wuxing.find(w => w.name === '水')?.percent ?? 0
  const fire = wuxing.find(w => w.name === '火')?.percent ?? 0
  const coldWarm = coldMonths.has(monthBranch) || water - fire >= 15 ? '偏寒' : hotMonths.has(monthBranch) || fire - water >= 15 ? '偏热' : '中和'
  const useGod = coldWarm === '偏寒' ? '火' : coldWarm === '偏热' ? '水/金' : '土/木'
  const hiddenStemsAll = pillars.flatMap(p => p.earthlyBranch.hidden.map(h => h.char))
  const hasGui = hiddenStemsAll.includes('癸')
  const hasBing = hiddenStemsAll.includes('丙') || pillars.some(p => p.heavenlyStem.char === '丙')

  const genderTag = (baziData.gender === '女' || baziData.gender === 'female') ? '坤造' : '乾造'
  const [privacyHidden, setPrivacyHidden] = useState(false)
  const [showAllSpirits, setShowAllSpirits] = useState(false)
  const [selectedDaYun, setSelectedDaYun] = useState<number>(0)
  const [selectedLiuNian, setSelectedLiuNian] = useState<number>(0)
  const [selectedLiuYue, setSelectedLiuYue] = useState<number>(0)

  // 滚动容器refs与联动
  const dyScrollRef = useRef<HTMLDivElement | null>(null)
  const lnScrollRef = useRef<HTMLDivElement | null>(null)

  const preventParentSwipe = useCallback((ref: React.RefObject<HTMLElement | null>) => {
    if (!ref.current) return
    const el = ref.current
    const onWheel = (e: Event) => { e.stopPropagation() }
    const onTouchStart = (e: Event) => { e.stopPropagation() }
    const onTouchMove = (e: Event) => { e.stopPropagation() }
    el.addEventListener('wheel', onWheel as any, { passive: false })
    el.addEventListener('touchstart', onTouchStart as any, { passive: false })
    el.addEventListener('touchmove', onTouchMove as any, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel as any)
      el.removeEventListener('touchstart', onTouchStart as any)
      el.removeEventListener('touchmove', onTouchMove as any)
    }
  }, [])

  useEffect(() => {
    const detach1 = preventParentSwipe(dyScrollRef as any)
    const detach2 = preventParentSwipe(lnScrollRef as any)
    return () => {
      detach1 && (detach1 as any)()
      detach2 && (detach2 as any)()
    }
  }, [preventParentSwipe])

  const syncIndexFromScroll = useCallback((ref: React.RefObject<HTMLDivElement | null>, setIndex: (n: number) => void) => {
    const el = ref.current
    if (!el) return
    const firstBtn = el.querySelector('button') as HTMLButtonElement | null
    const itemW = firstBtn?.offsetWidth || 44
    const total = el.querySelectorAll('button').length || 0
    if (total <= 0) return
    const idx = Math.max(0, Math.min(total - 1, Math.round(el.scrollLeft / itemW)))
    setIndex(idx)
  }, [])

  // 点击时平滑滚动对齐所选项（不随滚动自动改变选中）
  const scrollToIndex = useCallback((ref: React.RefObject<HTMLDivElement | null>, index: number) => {
    const el = ref.current
    if (!el) return
    const firstBtn = el.querySelector('button') as HTMLButtonElement | null
    const itemW = firstBtn?.offsetWidth || 44
    const target = Math.max(0, index) * itemW
    el.scrollTo({ left: target, behavior: 'smooth' })
  }, [])

  // 根据所选大运，计算对应的10年流年
  const liuNianOfSelected = useMemo(() => {
    if (!birthInfo || !paddedDaYun.length) return []
    const idx = Math.min(Math.max(selectedDaYun, 0), paddedDaYun.length - 1)
    const dy = paddedDaYun[idx]
    if (!dy) return []
    const dayStem = result.pillars.day.heavenlyStem.char
    return calculateLiuNian(birthInfo.year, dy.startYear, 10, dayStem)
  }, [birthInfo, paddedDaYun, selectedDaYun])

  // 小运：所选大运内逐年
  const xiaoYunItems = useMemo(() => {
    if (!birthInfo || !paddedDaYun.length) return [] as Array<{ year: number; age: string; stem: string; stemTG: string; branch: string; branchTG: string }>
    const idx = Math.min(Math.max(selectedDaYun, 0), paddedDaYun.length - 1)
    const dy = paddedDaYun[idx]
    if (!dy) return []
    const ageStart = parseInt(String(dy.age).replace(/\D/g, ''), 10) || 0
    return liuNianOfSelected.map((ln: any, j: number) => ({
      year: ln.year,
      age: `${ageStart + j}岁`,
      stem: ln.stem,
      stemTG: ln.stemTG,
      branch: ln.branch,
      branchTG: ln.branchTG,
    }))
  }, [birthInfo, paddedDaYun, selectedDaYun, liuNianOfSelected])

  // 切换大运时复位流年
  useEffect(() => { setSelectedLiuNian(0) }, [selectedDaYun])

  // 流年数据绑定为“所选大运对应10年”
  const paddedLiuNian = liuNianOfSelected.length > 0 ? liuNianOfSelected : []

  const maskDateTime = (s: string) => {
    if (!privacyHidden) return s
    const parts = s.split(' ')
    if (parts.length >= 2) {
      // YYYY-MM-DD HH:mm(:ss)? -> mask time part
      const date = parts[0]
      const time = parts[1]
      const masked = time.split(':').length >= 2 ? '**:**' + (time.split(':').length === 3 ? ':**' : '') : '**:**:**'
      return `${date} ${masked}`
    }
    return s
  }
  const nameDisplay = privacyHidden ? '**' : (baziData.name || '无名氏')
  const anySpiritsLong = pillars.some(p => (p.spirits?.length ?? 0) > 3)
  return (
    <div className={compact ? "p-2 space-y-3 text-sm md:text-base" : "p-3 space-y-8 text-lg"}>
      {/* Basic Info Header */}
      {!compact && (
        <div className="mb-2">
          <div className="border border-border rounded-md px-4 py-3 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gradient flex items-center">
                {baziData.name || "无名氏"}
                <span className="ml-2 text-lg font-medium text-foreground/80">（{genderTag}）</span>
              </div>

              <div className="text-base text-foreground/80">公历：{baziData.solarDate}</div>
              <div className="text-base text-foreground/80">农历：{baziData.lunarDate}</div>
            </div>
            <div className="flex-shrink-0"></div>
          </div>
        </div>
      )}

      {compact && (
        <div className="mb-2">
          <div className="border border-border rounded-md px-3 py-2 flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="font-bold text-gradient text-base md:text-lg">{nameDisplay}（{genderTag}）</div>
              <div className="text-sm md:text-base text-foreground/80">公历：{maskDateTime(baziData.solarDate)}</div>
              <div className="text-sm md:text-base text-foreground/80">农历：{maskDateTime(baziData.lunarDate)}</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex items-center justify-center size-7 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={handleCopyPro}
                aria-label="复制专业指令"
                title={copiedPro ? '已复制专业指令' : '复制专业指令'}
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center size-7 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setPrivacyHidden((v) => !v)}
                aria-label={privacyHidden ? '显示信息' : '隐藏信息'}
              >
                {privacyHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Four Pillars Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className={`w-full ${compact ? 'text-sm md:text-base' : 'text-base'}`}>
          <thead>
            <tr className="bg-card border-b border-border">
              <th className={`${compact ? 'p-1 w-14' : 'p-2'} text-center font-medium w-14`}></th>
              {compact && (
                <>
                  <th className={`${compact ? 'p-1 w-14' : 'p-2'} text-center font-medium w-14`}>流年</th>
                  <th className={`${compact ? 'p-1 w-14' : 'p-2'} text-center font-medium w-14`}>大运</th>
                  {/* 分隔列（表头占位） */}
                  <th className={`${compact ? 'p-0 w-3' : 'p-0'} text-center font-medium w-3`}></th>
                </>
              )}
              <th className={`${compact ? 'p-1 w-14' : 'p-2'} text-center font-medium w-14`}>年柱</th>
              <th className={`${compact ? 'p-1 w-14' : 'p-2'} text-center font-medium w-14`}>月柱</th>
              <th className={`${compact ? 'p-1 w-14' : 'p-2'} text-center font-medium w-14`}>日柱</th>
              <th className={`${compact ? 'p-1 w-14' : 'p-2'} text-center font-medium w-14`}>时柱</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border bg-card/70">
              <td className={`${compact ? 'p-0.5' : 'p-3'} w-14 whitespace-nowrap text-center text-muted-foreground`}>主星</td>
              {compact && (
                <>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                    <div className="font-bold text-foreground text-sm">{paddedLiuNian[selectedLiuNian]?.stemTG}</div>
                  </td>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                    <div className="font-bold text-foreground text-sm">{paddedDaYun[selectedDaYun]?.stemTG}</div>
                  </td>
                  {/* 竖向虚线分隔 */}
                  <td className={`${compact ? 'p-0 align-middle' : 'p-0 align-middle'}`}>
                    <div className="mx-1 h-12 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                  <div className={`font-bold text-foreground ${compact ? 'text-sm' : 'text-base'}`}>{p.heavenlyStem.tenGod}</div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/30">
              <td className={`${compact ? 'p-0.5' : 'p-3'} w-14 whitespace-nowrap text-center text-muted-foreground`}>天干</td>
              {compact && (
                <>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                    <div className={`font-bold ${compact ? 'text-lg md:text-2xl' : 'text-xl md:text-3xl'} ${colorifyStem(paddedLiuNian[selectedLiuNian]?.stem ?? '')}`}>
                      {paddedLiuNian[selectedLiuNian]?.stem ?? ''}
                    </div>
                  </td>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                    <div className={`font-bold ${compact ? 'text-lg md:text-2xl' : 'text-xl md:text-3xl'} ${colorifyStem(paddedDaYun[selectedDaYun]?.stem ?? '')}`}>
                      {paddedDaYun[selectedDaYun]?.stem ?? ''}
                    </div>
                  </td>
                  {/* 竖向虚线分隔 */}
                  <td className={`${compact ? 'p-0 align-middle' : 'p-0 align-middle'}`}>
                    <div className="mx-1 h-12 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                  <div className={`font-bold ${compact ? 'text-lg md:text-2xl' : 'text-xl md:text-3xl'} ${colorifyStem(p.heavenlyStem.char)}`}>{p.heavenlyStem.char}</div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/70">
              <td className={`${compact ? 'p-0.5' : 'p-3'} w-14 whitespace-nowrap text-center text-muted-foreground`}>地支</td>
              {compact && (
                <>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                    <div className={`font-bold ${compact ? 'text-lg md:text-2xl' : 'text-xl md:text-3xl'} ${colorifyBranch(paddedLiuNian[selectedLiuNian]?.branch ?? '')}`}>
                      {paddedLiuNian[selectedLiuNian]?.branch ?? ''}
                    </div>
                  </td>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                    <div className={`font-bold ${compact ? 'text-lg md:text-2xl' : 'text-xl md:text-3xl'} ${colorifyBranch(paddedDaYun[selectedDaYun]?.branch ?? '')}`}>
                      {paddedDaYun[selectedDaYun]?.branch ?? ''}
                    </div>
                  </td>
                  {/* 竖向虚线分隔 */}
                  <td className={`${compact ? 'p-0 align-middle' : 'p-0 align-middle'}`}>
                    <div className="mx-1 h-12 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                  <div className={`font-bold ${compact ? 'text-lg md:text-2xl' : 'text-xl md:text-3xl'} ${colorifyBranch(p.earthlyBranch.char)}`}>{p.earthlyBranch.char}</div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/30">
              <td className={`${compact ? 'p-0.5' : 'p-3'} w-14 whitespace-nowrap text-center text-muted-foreground`}>藏干</td>
              {compact && (
                <>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                    <div className="h-16 flex flex-col items-center justify-center gap-0 md:gap-0.5 text-sm text-muted-foreground overflow-hidden">
                      {(paddedLiuNian[selectedLiuNian]?.hidden ?? []).map((h, j) => (
                        <div key={j} className="leading-3 md:leading-4">
                          <span className={`${colorifyStem(h.char)} font-semibold mr-0.5 md:mr-1 ${compact ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>{h.char}</span>
                          <span className={`font-bold text-foreground ${compact ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>{h.tenGod}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                    <div className="h-16 flex flex-col items-center justify-center gap-0 md:gap-0.5 text-sm text-muted-foreground overflow-hidden">
                      {(paddedDaYun[selectedDaYun]?.hidden ?? []).map((h, j) => (
                        <div key={j} className="leading-3 md:leading-4">
                          <span className={`${colorifyStem(h.char)} font-semibold mr-0.5 md:mr-1 ${compact ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>{h.char}</span>
                          <span className={`font-bold text-foreground ${compact ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>{h.tenGod}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  {/* 竖向虚线分隔 */}
                  <td className={`${compact ? 'p-0 align-middle' : 'p-0 align-middle'}`}>
                    <div className="mx-1 h-12 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? 'p-0.5' : 'p-3'} text-center`}>
                  <div className="h-16 flex flex-col items-center justify-center gap-0 md:gap-0.5 overflow-hidden">
                    {p.earthlyBranch.hidden.map((h, j) => (
                      <div key={j} className={`${compact ? 'text-xs md:text-sm' : 'text-sm'} text-muted-foreground leading-3 md:leading-4`}>
                        <span className={`${colorifyStem(h.char)} font-semibold mr-0.5 md:mr-1 ${compact ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>{h.char}</span>
                        <span className={`font-bold text-foreground ${compact ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>{h.tenGod}</span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/30">
              <td className={`${compact ? 'p-0.5' : 'p-3'} w-14 whitespace-nowrap text-center text-muted-foreground`}>星运</td>
              {compact && (
                <>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>{paddedLiuNian[selectedLiuNian]?.fortune ?? ''}</td>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>{paddedDaYun[selectedDaYun]?.fortune ?? ''}</td>
                  <td className={`${compact ? 'p-0 align-middle' : 'p-0 align-middle'}`}>
                    <div className="mx-1 h-8 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>
                  {p.fortune}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/70">
              <td className={`${compact ? 'p-0.5' : 'p-3'} w-14 whitespace-nowrap text-center text-muted-foreground`}>自坐</td>
              {compact && (
                <>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>{paddedLiuNian[selectedLiuNian]?.selfSit ?? ''}</td>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>{paddedDaYun[selectedDaYun]?.selfSit ?? ''}</td>
                  <td className={`${compact ? 'p-0 align-middle' : 'p-0 align-middle'}`}>
                    <div className="mx-1 h-8 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>
                  {p.selfSit}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/30">
              <td className={`${compact ? 'p-0.5' : 'p-3'} w-14 whitespace-nowrap text-center text-muted-foreground`}>空亡</td>
              {compact && (
                <>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>{paddedLiuNian[selectedLiuNian]?.voidness ?? ''}</td>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>{paddedDaYun[selectedDaYun]?.voidness ?? ''}</td>
                  <td className={`${compact ? 'p-0 align-middle' : 'p-0 align-middle'}`}>
                    <div className="mx-1 h-8 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>
                  {p.voidness}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/70">
              <td className={`${compact ? 'p-0.5' : 'p-3'} w-14 whitespace-nowrap text-center text-muted-foreground`}>纳音</td>
              {compact && (
                <>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>{paddedLiuNian[selectedLiuNian]?.nayin ?? ''}</td>
                  <td className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>{paddedDaYun[selectedDaYun]?.nayin ?? ''}</td>
                  <td className={`${compact ? 'p-0 align-middle' : 'p-0 align-middle'}`}>
                    <div className="mx-1 h-8 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? 'p-0.5' : 'p-3'} text-center text-sm`}>
                  {p.nayin}
                </td>
              ))}
            </tr>
            <tr className="bg-card/70">
              <td className={`${compact ? 'p-0' : 'p-3'} w-14 whitespace-nowrap text-center text-muted-foreground align-top`}>
                <div className="flex flex-col items-center gap-1">
                  <span>神煞</span>
                  {isMobile && compact && anySpiritsLong && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors px-1.5 py-0.5"
                      onClick={() => setShowAllSpirits(v => !v)}
                      aria-label={showAllSpirits ? '收起神煞' : '展开神煞'}
                      aria-expanded={showAllSpirits}
                      aria-controls="spirits-list"
                    >
                      {showAllSpirits ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              </td>
              {compact && (
                <>
                  <td className={`${compact ? 'p-0' : 'p-3'} text-center text-[12px] align-top`}>
                    <div className="space-y-1 text-center">
                      {(((paddedLiuNian[selectedLiuNian]?.gods) ?? [])
                        .slice(0, (compact && isMobile && !showAllSpirits) ? 1 : 999))
                        .map((g, i) => (
                          <div key={i}>{g}</div>
                        ))}
                    </div>
                  </td>
                  <td className={`${compact ? 'p-0' : 'p-3'} text-center text-[12px] align-top`}>
                    <div className="space-y-1 text-center">
                      {(((paddedDaYun[selectedDaYun]?.gods) ?? [])
                        .slice(0, (compact && isMobile && !showAllSpirits) ? 1 : 999))
                        .map((g, i) => (
                          <div key={i}>{g}</div>
                        ))}
                    </div>
                  </td>
                  <td className={`${compact ? 'p-0 align-middle' : 'p-0 align-middle'}`}>
                    <div className="mx-1 h-10 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => {
                // PC端始终显示全部，移动端紧凑模式可折叠
                const list = (compact && isMobile && !showAllSpirits) ? p.spirits.slice(0, 1) : p.spirits
                return (
                  <td key={i} className={`${compact ? 'p-0 text-[12px]' : 'p-3 text-sm'} text-center align-top`}>
                    <div className="space-y-1 text-center" {...(i === 0 ? { id: 'spirits-list' } : {})}>
                      {list.map((s, j) => (
                        <div key={j}>{s}</div>
                      ))}
                    </div>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {compact && (
        <div className="mt-3 space-y-3">
          {/* 起运/交运信息 - 暂时隐藏，需要实现真实计算 */}

          {/* 大运一行（参考布局重写，美化滚动框/缩小按钮/修正选中态） */}
          <div className="border border-border rounded-md p-3">
            <div className="flex items-center gap-2">
              <div className="w-10 shrink-0 text-center leading-tight text-muted-foreground">
                <div className="text-sm">大</div>
                <div className="text-sm">运</div>
              </div>
              <div
                ref={dyScrollRef}
                className="flex-1 h-24 md:h-28 overflow-x-auto overflow-y-hidden overscroll-contain no-scrollbar rounded-lg bg-card/40 md:bg-card/50 border border-border shadow-inner snap-x snap-proximity"
                style={{ touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' as any }}
              >
                <div className="h-full inline-flex items-stretch gap-0 whitespace-nowrap">
                  {paddedDaYun.map((it, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => { flushSync(() => setSelectedDaYun(idx)); scrollToIndex(dyScrollRef, idx) }}
                      className={`w-9 md:w-11 h-full px-0.5 py-1 inline-flex flex-col items-center justify-center gap-0 leading-tight text-center select-none snap-center ${selectedDaYun === idx ? 'border-2 border-secondary bg-background/40' : 'border border-transparent'} ${idx > 0 ? '' : ''}`}
                    >
                      <span className="text-[10px] md:text-[11px] font-medium text-foreground/90">{it.year}</span>
                      <span className="text-[10px] md:text-[11px] text-muted-foreground">{it.age}</span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyStem(it.stem)} font-semibold text-base md:text-lg`}>{it.stem}</span>
                        <span className="text-xs md:text-sm text-foreground/80">{abbrTenGod(it.stemTG)}</span>
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyBranch(it.branch)} font-semibold text-base md:text-lg`}>{it.branch}</span>
                        <span className="text-xs md:text-sm text-foreground/80">{abbrTenGod(it.branchTG)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 流年一行（参考布局重写：美化滚动框/修正选中态/去除内部小框） */}
          <div className="border border-border rounded-md p-3">
            <div className="flex items-center gap-2">
              <div className="w-10 shrink-0 text-center leading-tight text-muted-foreground">
                <div className="text-sm">流</div>
                <div className="text-sm">年</div>
              </div>
              <div
                ref={lnScrollRef}
                className="flex-1 h-24 md:h-28 overflow-x-auto overflow-y-hidden overscroll-contain no-scrollbar rounded-lg bg-card/40 md:bg-card/50 border border-border shadow-inner snap-x snap-proximity"
                style={{ touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' as any }}
              >
                <div className="h-full inline-flex items-stretch gap-0 whitespace-nowrap">
                  {paddedLiuNian.map((it, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => { flushSync(() => setSelectedLiuNian(idx)); scrollToIndex(lnScrollRef, idx) }}
                      className={`w-9 md:w-11 h-full px-0.5 py-1 inline-flex flex-col items-center justify-center gap-0 leading-tight text-center select-none snap-center ${selectedLiuNian === idx ? 'border-2 border-secondary bg-background/40' : 'border border-transparent'} ${idx > 0 ? '' : ''}`}
                    >
                      <span className="text-[10px] md:text-[11px] font-medium text-foreground/90">{it.year}</span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyStem(it.stem)} font-semibold text-base md:text-lg`}>{it.stem}</span>
                        <span className="text-xs md:text-sm text-foreground/80">{abbrTenGod(it.stemTG)}</span>
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyBranch(it.branch)} font-semibold text-base md:text-lg`}>{it.branch}</span>
                        <span className="text-xs md:text-sm text-foreground/80">{abbrTenGod(it.branchTG)}</span>
                      </span>
                      {it.ganzhi && (
                        <span className="text-[10px] text-muted-foreground mt-0.5">{it.ganzhi}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 流月一行（参考布局重写：美化滚动框/修正选中态/缩小按钮） */}
          <div className="border border-border rounded-md p-3">
            <div className="flex items-center gap-2">
              <div className="w-10 shrink-0 text-center leading-tight text-muted-foreground">
                <div className="text-sm">流</div>
                <div className="text-sm">月</div>
              </div>
              <div className="flex-1 h-24 md:h-28 overflow-x-auto overflow-y-hidden no-scrollbar rounded-lg bg-card/40 md:bg-card/50 border border-border shadow-inner">
                <div className="h-full inline-flex items-stretch gap-0 whitespace-nowrap">
                  {paddedLiuYue.map((it, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedLiuYue(idx)}
                      className={`w-9 md:w-11 h-full px-0.5 py-1 inline-flex flex-col items-center justify-center gap-0 leading-tight text-center select-none ${selectedLiuYue === idx ? 'border-2 border-secondary bg-background/40' : 'border border-transparent'} ${idx > 0 ? '' : ''}`}
                    >
                      <span className="text-[10px] md:text-[11px] text-foreground/90">{it.name}</span>
                      <span className="text-[10px] md:text-[11px] text-muted-foreground">{it.date}</span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyStem(it.stem)} font-semibold text-base md:text-lg`}>{it.stem}</span>
                        <span className="text-xs md:text-sm text-foreground/80">{it.stemTG}</span>
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyBranch(it.branch)} font-semibold text-base md:text-lg`}>{it.branch}</span>
                        <span className="text-xs md:text-sm text-foreground/80">{it.branchTG}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!compact && (
      <div className="border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={handleCopyPro}
            aria-label="复制专业指令"
            title={copiedPro ? "已复制专业指令" : "复制专业指令"}
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">格局</h3>
          <span className="text-xs text-muted-foreground">快速洞悉八字框架与隐藏潜力</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-secondary">{geju.main}</span>
            <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded">{geju.status}</span>
          </div>
          <div className="text-base font-medium mb-2">{geju.pattern}</div>
          <p className="text-muted-foreground text-xs leading-relaxed">{geju.description}</p>
        </div>
        <div>
          <div className="text-xs font-medium mb-2">其他格局天赋</div>
          <div className="flex flex-wrap gap-2">
            {geju.others.map((g, i) => (
              <span key={i} className="text-xs bg-card border border-border px-2 py-1 rounded">
                {g}
              </span>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full text-sm">
          问万象AI
        </Button>
      </div>
      )}

      {/* Five Elements */}
      {!compact && (
      <div className="border border-border rounded-lg p-4 space-y-3">
        <h3 className="text-lg font-bold">五行</h3>
        <div className="space-y-2">
          {wuxing.map((w) => (
            <div key={w.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{w.name}</span>
                <span className="text-muted-foreground">{w.percent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${w.color}`} style={{ width: `${w.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">点击能量柱可查看能量来源</p>
        <Button variant="ghost" size="sm" className="w-full text-sm">
          问万象AI
        </Button>
      </div>
      )}

      {/* Ten Gods */}
      {!compact && (
      <div className="border border-border rounded-lg p-4 space-y-3">
        <h3 className="text-lg font-bold">十神</h3>
        <div className="space-y-2">
          {shishen
            .filter((s) => s.percent > 0)
            .map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.percent}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: `${s.percent}%` }} />
                </div>
              </div>
            ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full text-sm">
          问万象AI
        </Button>
      </div>
      )}

      {/* Additional Sections */}
      {!compact && (
      <div className="border border-border rounded-lg p-4 space-y-2">
        <h3 className="text-lg font-bold">神煞</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-secondary">•</span>
            <span>领导才能 - 将星</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary">•</span>
            <span>聪明伶俐 - 华盖</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary">•</span>
            <span>财源滚滚 - 金神</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary">•</span>
            <span>贵人相助 - 福星贵人</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full text-sm">
          问万象AI
        </Button>
      </div>
      )}

      {!compact && (
      <div className="border border-border rounded-lg p-4 space-y-2">
        <h3 className="text-lg font-bold">身强身弱</h3>
        <div className="text-center py-4">
          <div className="text-sm text-muted-foreground mb-2">木日 · 太旺</div>
          <div className="text-xl font-medium">盘根错节的千年藤萝</div>
        </div>
        <Button variant="ghost" size="sm" className="w-full text-sm">
          问万象AI
        </Button>
      </div>
      )}

      {!compact && (
      <div className="border border-border rounded-lg p-4 space-y-2">
        <h3 className="text-lg font-bold">日柱等级</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">乙丑</div>
            <div className="text-sm text-muted-foreground">玉女佩珠日</div>
          </div>
          <span className="text-base bg-secondary/20 text-secondary px-3 py-1 rounded">中等</span>
        </div>
        <Button variant="ghost" size="sm" className="w-full text-sm">
          问万象AI
        </Button>
      </div>
      )}

      {/* 调候 */}
      {!compact && (
      <div className="border border-border rounded-lg p-4 space-y-3">
        <h3 className="text-lg font-bold">调候</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">寒暖等级</div>
            <div className="text-xl font-bold">{coldWarm}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">调候用神</div>
            <div className="text-xl font-bold">{useGod}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">癸</div>
            <div className="font-medium">{hasGui ? '藏于地支' : '缺少'}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">丙</div>
            <div className="font-medium">{hasBing ? '不缺' : '缺少'}</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          您八字里存在能调节气候的能量，但力量稍弱，需要外界助力（如特定的人、环境或时机）才能达到最舒适的状态。这意味着您的才能需要被“赏识”或“激活”，方能完全施展。
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          您的八字格局偏向{coldWarm === '偏寒' ? '寒湿' : coldWarm === '偏热' ? '燥热' : '平和'}，建议多接触{coldWarm === '偏寒' ? '阳光、运动' : coldWarm === '偏热' ? '水与静心' : '适度的自然四时'}，以取得更佳的内外平衡。
        </p>
        <Button variant="ghost" size="sm" className="w-full text-sm">
          问万象AI
        </Button>
      </div>
      )}
    </div>
  )
}
