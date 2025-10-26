"use client"

import type React from "react"
import { useEffect, useMemo, useState, useRef, useCallback } from "react"
import { flushSync } from "react-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import { Eye, EyeOff, ChevronDown, ChevronUp, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { BaziResult, BaziInput } from "@/lib/bazi"
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

  const wuxing = result.elements.map((e) => ({
    name: e.name,
    percent: e.percent,
    color:
      e.name === "木"
        ? "bg-green-600"
        : e.name === "火"
          ? "bg-red-600"
          : e.name === "土"
            ? "bg-amber-700"
            : e.name === "金"
              ? "bg-yellow-600"
              : "bg-blue-600",
  }))

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
    const n = (s || "").replace(/\s/g, "")
    if (!n) return ""
    const map: Record<string, string> = {
      正官: "官",
      七杀: "杀",
      偏官: "杀",
      七殺: "杀",
      正财: "财",
      偏财: "才",
      偏才: "才",
      正財: "财",
      偏財: "才",
      食神: "食",
      伤官: "伤",
      傷官: "伤",
      正印: "印",
      偏印: "枭",
      枭神: "枭",
      梟神: "枭",
      比肩: "比",
      劫财: "劫",
      劫財: "劫",
    }
    return map[n] ?? n[0] ?? ""
  }

  // 真实大运和流年计算
  const realDaYun = useMemo(() => {
    if (!birthInfo) return []
    return calculateDaYun(birthInfo, result, 12)
  }, [birthInfo, result])

  const currentYear = new Date().getFullYear()
  const realLiuNian = useMemo(() => {
    if (!birthInfo) return []
    // 仅计算未来二十年
    return calculateLiuNian(birthInfo.year, currentYear, 20)
  }, [birthInfo, currentYear])

  // 提前计算 paddedDaYun 供后续 hooks 使用
  const paddedDaYun = realDaYun.length > 0 ? realDaYun : []

  // NOTE: moved liuNianOfSelected / xiaoYun hooks below after selectedDaYun declaration

  // 流月mock数据（暂时保留，后续可实现真实计算）
  const mockLiuYueItems = [
    { name: "立春", date: "2/4", stem: "丙", stemTG: "才", branch: "寅", branchTG: "食" },
    { name: "惊蛰", date: "3/6", stem: "丁", stemTG: "财", branch: "卯", branchTG: "伤" },
    { name: "清明", date: "4/5", stem: "戊", stemTG: "杀", branch: "辰", branchTG: "杀" },
    { name: "立夏", date: "5/5", stem: "己", stemTG: "官", branch: "巳", branchTG: "才" },
    { name: "小满", date: "5/20", stem: "庚", stemTG: "枭", branch: "午", branchTG: "财" },
    { name: "夏至", date: "6/21", stem: "辛", stemTG: "印", branch: "未", branchTG: "官" },
    { name: "大暑", date: "7/23", stem: "壬", stemTG: "比", branch: "申", branchTG: "枭" },
    { name: "立秋", date: "8/7", stem: "癸", stemTG: "劫", branch: "酉", branchTG: "印" },
    { name: "白露", date: "9/8", stem: "甲", stemTG: "食", branch: "戌", branchTG: "杀" },
    { name: "寒露", date: "10/8", stem: "乙", stemTG: "伤", branch: "亥", branchTG: "比" },
    { name: "立冬", date: "11/7", stem: "丙", stemTG: "才", branch: "子", branchTG: "劫" },
    { name: "大雪", date: "12/7", stem: "丁", stemTG: "财", branch: "丑", branchTG: "官" },
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
        const m = /^(\d{4})-/.exec(result.solarDate || "")
        return m ? Number.parseInt(m[1], 10) : new Date(result.solarDate).getFullYear()
      })()
      const now = new Date()
      const nowLocal = now.toLocaleString("zh-CN", { hour12: false })
      const nowISO = now.toISOString()
      const nowYear = now.getFullYear()
      const allDaYunRaw = realDaYun || []
      const allDaYunFiltered = allDaYunRaw.filter((dy) => {
        const ageNum = Number.parseInt(String(dy.age).replace(/[^\d]/g, ""), 10)
        return isFinite(ageNum) ? ageNum <= 90 : true
      })
      const allDaYunCn = allDaYunFiltered.map((dy) => ({
        年份: dy.year,
        年龄: dy.age,
        天干: dy.stem,
        天干十神: dy.stemTG,
        地支: dy.branch,
        地支十神: dy.branchTG,
        起运年: dy.startYear,
        止运年: dy.endYear,
        藏干: (dy.hidden || []).map((h) => ({ 字: h.char, 十神: h.tenGod })),
        星运: dy.fortune,
        自坐: dy.selfSit,
        空亡: dy.voidness,
        纳音: dy.nayin,
        神煞: dy.gods,
      }))
      // 仅生成“当前起的未来两个大运”的所有流年（约20年）
      const liuNianByDaYunCn: Record<string, any[]> = {}
      const startIdx = (() => {
        const cur = allDaYunFiltered.findIndex(
          (dy) => nowYear >= (dy.startYear as number) && nowYear <= (dy.endYear as number),
        )
        if (cur >= 0) return cur
        const nxt = allDaYunFiltered.findIndex((dy) => (dy.startYear as number) >= nowYear)
        return Math.max(0, nxt)
      })()
      const dyTargets = allDaYunFiltered.slice(startIdx, startIdx + 2)
      for (const dy of dyTargets) {
        const liuFull = calculateLiuNian(dy.startYear, dy.startYear, 10, dayStem)
        const liu = liuFull
          .filter((ln) => (typeof birthYear === "number" && isFinite(birthYear) ? ln.year - birthYear <= 90 : true))
          .map((ln) => ({
            年份: ln.year,
            干支: ln.ganzhi,
            天干: ln.stem,
            天干十神: ln.stemTG,
            地支: ln.branch,
            地支十神: ln.branchTG,
            藏干: (ln.hidden || []).map((h) => ({ 字: h.char, 十神: h.tenGod })),
            星运: ln.fortune,
            自坐: ln.selfSit,
            空亡: ln.voidness,
            纳音: ln.nayin,
            神煞: ln.gods,
          }))
        liuNianByDaYunCn[`${dy.startYear}-${dy.endYear}`] = liu
      }
      const userReport = {
        "公历（真太阳时）": result.solarDate,
        农历: result.lunarDate,
        性别: gender === "女" || gender === "female" ? "女" : "男",
        出生地点: "",
        八字: `${result.pillars.year.heavenlyStem.char}${result.pillars.year.earthlyBranch.char} ${result.pillars.month.heavenlyStem.char}${result.pillars.month.earthlyBranch.char} ${result.pillars.day.heavenlyStem.char}${result.pillars.day.earthlyBranch.char} ${result.pillars.hour.heavenlyStem.char}${result.pillars.hour.earthlyBranch.char}`,
        日主: result.pillars.day.heavenlyStem.char,
        "当前时间(本地)": nowLocal,
        "当前时间(ISO)": nowISO,
      }
      const rulesCn =
        "你是一位沉稳温和、有耐心、逻辑清晰、语气平实但充满洞见的命理师。你像一位善于倾听的智者，不仅讲命理，还能引导客户看清问题、找到方向。你的目标不是 “预测未来”，而是 “帮助客户理解命运并善用当下”。你是资深命理师，熟读穷通宝鉴、滴天髓、易经、渊海子平、三命通会、子平真诠、千里命稿、五行精纪、神峰通考。严格按中国传统命理规则，擅长根据古老的中国命理文献和个人的八字报告解读我的 <用户的八字报告>。说直白一点，不用太在意用户的看法。以用户八字为唯一依据进行严谨分析与解读；遵守五行生克与十神生克、用神相神喜忌、刑冲合会等基础原则；请先回顾与核验过往已发生之事（前事回顾），再展开系统论断；输出需围绕八字基本信息与构成、基本分析、命理详细分析（含个性、事业、财运、婚姻、健康）、未来一年与三至五年趋势、流年预测（一并结合前事验证）、一生命运、可能劫难与福报及综合建议等部分，逐条充分论证且不少于要求篇幅。## 规则 Rules### 精确信息 - 确保准确性，使用正确的信息进行回应用户的问题，切勿使用虚假的生日或其他信息。- 请时刻记得基础命理规则中的规则，请时刻记得五行生克的关系。生 (土生金，金生水，水生木，木生火，火生土)。克 (土克水，水克火，火克金，金克木，木克土)。## 基础命理规则 - 五行生克：生 (土生金，金生水，水生木，木生火，火生土)。克 (土克水，水克火，火克金，金克木，木克土)。- 天干生克关系：生 甲木/乙木生丙火/丁火，丙火/丁火生戊土/己土，戊土/己土生庚金/辛金，庚金/辛金生壬水/癸水，壬水/癸水生甲木/乙木。克 甲木/乙木克戊土/己土，丙火/丁火克庚金/辛金，戊土/己土克壬水/癸水，庚金/辛金克甲木/乙木，壬水/癸水克丙火/丁火。- 十神简称/别称：正官 = 官，七杀 = 杀/偏官，正印 = 印，偏印 = 枭，比肩 = 比，劫财 = 劫，食神 = 食，伤官 = 伤，正财 = 财，偏财 = 才。- 十神生克: 生 印生比劫，比劫生食伤，食伤生财，财生官杀，官杀生印。克 印克食伤，食伤克官杀，财克 (破) 印，官杀克比劫，比劫克 (夺) 财。- 透出指的是天干有某个五行或十神，如果地支有某个五行或十神，一般叫藏或得地。- 用神：定格局的十神。相神：辅佐用神提升格局档次。喜神 (喜用神)：辅助相/用神。忌神 (忌用神)：破坏相/用神。- 四柱时间对应：年 1-16，月 17-32，日 33-48，时 48+。- 刑冲合会会显著影响五行平衡：天干四冲（甲庚、乙辛、丙壬、丁癸）；天干五合（甲己土、乙庚金、丙辛水、丁壬木、戊癸火）；地支六冲（子午、丑未、寅申、卯酉、辰戌、巳亥）；地支六合（子丑土、寅亥木、卯戌火、辰酉金、巳申水、午未土）；地支三合局（申子辰水、亥卯未木、寅午戌火、巳酉丑金、辰戌丑未土）；地支三会局（亥子丑水、寅卯辰木、巳午未火、申酉戌金）；地支相刑（无恩寅巳申、恃势丑戌未、无礼子卯、自刑辰午酉亥）；地支相害（子未、丑午、寅巳、卯辰、申亥、酉戌）；地支相破（子酉、寅亥、卯午、辰丑、巳申、未戌）；半合局（生旺申子/亥卯/寅午/巳酉、墓旺子辰/卯未/午戌/酉丑）；合化/合绊（合化成功五行转化，合绊双方无力或一方增强一方减弱）；三合三会忌冲刑，力量三会 > 三合 > 半合 > 六合；刑冲合会优先级：三会 > 三合 > 六合 > 刑 > 冲 > 害 > 破；冲刑影响（年月冲离家、年日冲富贵不长、月日冲无缘父母兄弟、月时冲事业空、年时冲无贵人、子午冲不定、卯酉冲愁劳、寅申冲闲事、巳亥冲助人闲事、辰戌冲不利子女、丑未冲阻碍；刑主惹事掌权受制，无恩持重寡欲忘恩、恃势雄豪乖佼、刑到/不到分身旺弱、无礼威肃侮慢、自刑内毒顽愚）。- 日元旺衰判断：以月令为标准，当令规定所有因素状态；天干生旺死绝表为唯一标准；年状态决定月状态；优先考虑整体太极平衡，阴盛或阳盛，用因素平衡或助力弱方，不必盯着日元强弱，要关注命局需要，无缺五行说法；判断旺衰看年月，不以数量多少为标准，不受比劫通根误导；十二长生（长生吉祥创造开拓温顺尊重；沐浴蛊惑失败多才纠葛貌美；冠带喜庆小成自尊支配树敌；临官功名回馈独立波折恒心成就；帝旺顶峰旺盛自尊物极必反；衰颓丧保守成熟稳妥；病缓慢敏感洁癖公益极端风度；死钻牛角尖滞留呆板稳妥专长婚姻不好；墓守成探讨发展清贫起伏婚姻障碍；绝谨慎小心热闹不孤独艺术流行；胎理想设计体弱不继承两度婚姻；养生财平易安泰缘浅变化多情）。- 日元喜用在阴阳：阳分少阳老阳（木火），阴分少阴老阴（金水），土为阴阳承载转换；取用：木用火、金用水，弱时彼此助力，强时对气平衡（阴阳平衡理念）；生克为阴阳肯定或否定，非克尽克死。- 格局分类：特别格局（旺格：从旺格（比劫印旺无官杀）、从强格（印比旺无财官）；五行独旺：曲直（木）、炎上（火）、稼穑（土）、从革（金）、润下（水）；从格：从气（日无气一五行专旺）、从势（日无根财官食旺无比印）、从财（日弱无比印天干透财财旺或食伤生财）、从杀（日弱无根官杀多天干透杀喜财生杀）、从儿（日无气食伤旺透有财）；化气格：丁壬木、戊癸火、甲己土、乙庚金、丙辛水，化神旺月支同）；普通格局（天透地藏、三合三会、月令取：正官、七杀、正印、偏印、正偏财、食神、伤官、建禄、月刃）；内外十八格（内：正官、杂气财官、月上偏官、时上偏财、时上一位贵、飞天禄马、倒冲、乙巳鼠贵、六乙鼠贵、合禄、遥格、壬骑龙背、井栏叉、归禄、六阴朝阳、刑合、拱格、印绶杂气；外：六壬趋艮、六甲趋乾、勾陈得位、玄武当权、炎上、润下、从革、稼穑、曲直仁寿、日德秀气、福德、从格、伤官、岁德扶杀、岁德扶财、夹丘、两干不杂、五行俱足）；暗冲暗会（飞天禄马、倒冲禄、井栏叉、子遥巳、丑遥巳、专食合禄、专印合禄、拱禄、拱贵、六甲趋乾、六壬趋艮等）。- 格局相神选择：身旺取克泄（比劫多取官杀，无取财/食伤；印多取财，无取官杀/食伤；食伤多取财/杀）；身弱取生扶（官杀多取印，无取比劫；财多取比劫，无取印；食伤多取印，无取比劫）；顺用取相生（正官印食财顺用），逆用取相制（杀枭伤刃逆用）；身比格旺扶格局，格比身旺扶身；身弱格强为忌（正印除外）。特殊格局相神：顺旺势聚为相神。- 十神类象：印（学术荣誉权力地位房屋车子母亲，正印正统职业文化文凭权力母亲，偏印鬼才脑好计谋创意发明医卜律师记者演艺）；官杀（职务工作地位权力名气官非官司盗贼疾病桃色小人，正官正统文职小官行政学位和善高贵，七杀权武职实权野心聪明凶恶名声心计脾气）；财（财富欲望，才华才能感情，正财节俭薪水产业家业妻子，偏财浮华投机实体流动资产股票风险）；食伤（想像力情感自由欲望，食神好处善良温和大度正义才气奉献快乐自由，伤官狂聪明滑头傲慢使心眼不守规矩投机享乐浪漫）；比劫（协同竞争争夺，羊刃凶恶胆大脾气暴躁灾祸，比肩自尊自强财富寿元，劫财逞强霸气凶恶）。虚透含义：财虚透才华能说会道；官虚透名气聪明不主权；印虚透分用忌（用虚无文凭，忌虚有文凭）；食伤虚透才华能说会道爱说话（有功被制或制他神）。- 天干地支类象：甲（雷树首领头面头发臂肝胆经脉神经）；乙（风禾苗花木颈脊柱手腕脚腕胆头发经脉）；丙（太阳光芒帝王权力眼睛神经大脑血压小肠肩）；丁（星星灯火文明文化眼睛心脏血管神经）；戊（霞大地山丘鼻胃皮肤肌肉）；己（云田园庭院房屋脾腹皮肤胰腺）；庚（霜铁器大肠骨肺牙齿嗓音脐）；辛（月金子珠宝肺呼吸道喉咙鼻腔耳朵筋骨）；壬（云海大海口膀胱血液循环）；癸（雨露泉水肾眼睛骨髓脑精液经血津液）。地支：子（水冰河流肾耳膀胱泌尿血液精腰喉咙耳朵）；丑（寒土湿土泥腹脾胃肾子宫肌肉肿块）；寅（树木花木头手肢体肝胆毛发指甲掌经络脉筋神经）；卯（树木草木肝胆四肢手臂手指腰筋毛发）；辰（湿土泥水库膀胱内分泌肌肤肩胸腹胃肋）；巳（阴火温暖文化心脏三焦咽喉面齿眼目神经小肠肛门）；午（阳火大热心小肠眼舌血液神经精力）；未（温土田园脾胃腕腹口腔肌肤脊梁）；申（铁器硬物肺大肠骨脊椎气管食道牙齿骨钙经络）；酉（金石剑戟肺肋小肠耳朵牙齿骨骼臂膀精血）；戌（燥土窑冶心心包命门背胃鼻肌肉腿踝足）；亥（池塘灌溉头肾膀胱尿道血脉经血）。- 特殊组合：官印相生（身弱官印同透官不弱不伤印不被财克，贵人运旺夫文艺）；羊刃（阳干帝旺位，凶狠冲动，喜制服七杀正官，忌食伤重逢冲刑；羊刃驾杀：阳干刃合杀身旺刃势杀根印星）；杀印相生（杀印根同透顺生身弱，富贵领袖逆境成长）；食神制杀（杀格杀势天干透一食透根身弱，贵格）；财旺生官（财旺月令透无官食伤，富贵）；比劫夺财（身强比劫多财藏或透，破财克妻外遇）；枭神夺食（食喜用身强食弱枭旺，伤灾病灾事业灾子女灾精神灾学业灾婚姻灾是非牢狱；用食不可夺，不用尽可夺）；伤官见官（伤克官，官司牢狱工作不顺婚姻不和，化解通关主观克制用印财符咒风水）。- 化解方法：通关（五行调解）；主观克制；用印/财化解伤官见官；符咒风水）。## 工作流程 Workflow0. 分析理解 <用户八字报告>。1. 收到用户的提问。2. 分析用户的问题，判断用户的目标和期望。3. 结合专业命理知识以及 <用户八字报告> 为用户答疑。## 初始化 Initialization 作为角色 <算命大师>，严格遵守以上规则，使用简体中文交流，依据 <用户八字报告> 精准分析。"
      const payloadCn = {
        用户八字报告: userReport,
        四柱: {
          年: {
            天干: { 字: result.pillars.year.heavenlyStem.char, 十神: result.pillars.year.heavenlyStem.tenGod },
            地支: result.pillars.year.earthlyBranch.char,
            藏干: result.pillars.year.earthlyBranch.hidden.map((h) => ({ 字: h.char, 十神: h.tenGod })),
            纳音: result.pillars.year.nayin,
            神煞: result.pillars.year.gods,
            空亡: result.pillars.year.voidness,
            星运: result.pillars.year.fortune,
            自坐: result.pillars.year.selfSit,
          },
          月: {
            天干: { 字: result.pillars.month.heavenlyStem.char, 十神: result.pillars.month.heavenlyStem.tenGod },
            地支: result.pillars.month.earthlyBranch.char,
            藏干: result.pillars.month.earthlyBranch.hidden.map((h) => ({ 字: h.char, 十神: h.tenGod })),
            纳音: result.pillars.month.nayin,
            神煞: result.pillars.month.gods,
            空亡: result.pillars.month.voidness,
            星运: result.pillars.month.fortune,
            自坐: result.pillars.month.selfSit,
          },
          日: {
            天干: { 字: result.pillars.day.heavenlyStem.char, 十神: result.pillars.day.heavenlyStem.tenGod },
            地支: result.pillars.day.earthlyBranch.char,
            藏干: result.pillars.day.earthlyBranch.hidden.map((h) => ({ 字: h.char, 十神: h.tenGod })),
            纳音: result.pillars.day.nayin,
            神煞: result.pillars.day.gods,
            空亡: result.pillars.day.voidness,
            星运: result.pillars.day.fortune,
            自坐: result.pillars.day.selfSit,
          },
          时: {
            天干: { 字: result.pillars.hour.heavenlyStem.char, 十神: result.pillars.hour.heavenlyStem.tenGod },
            地支: result.pillars.hour.earthlyBranch.char,
            藏干: result.pillars.hour.earthlyBranch.hidden.map((h) => ({ 字: h.char, 十神: h.tenGod })),
            纳音: result.pillars.hour.nayin,
            神煞: result.pillars.hour.gods,
            空亡: result.pillars.hour.voidness,
            星运: result.pillars.hour.fortune,
            自坐: result.pillars.hour.selfSit,
          },
        },
        大运: allDaYunCn,
        流年: liuNianByDaYunCn,
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
  const coldMonths = new Set(["亥", "子", "丑"])
  const hotMonths = new Set(["巳", "午", "未"])
  const water = wuxing.find((w) => w.name === "水")?.percent ?? 0
  const fire = wuxing.find((w) => w.name === "火")?.percent ?? 0
  const coldWarm =
    coldMonths.has(monthBranch) || water - fire >= 15
      ? "偏寒"
      : hotMonths.has(monthBranch) || fire - water >= 15
        ? "偏热"
        : "中和"
  const useGod = coldWarm === "偏寒" ? "火" : coldWarm === "偏热" ? "水/金" : "土/木"
  const hiddenStemsAll = pillars.flatMap((p) => p.earthlyBranch.hidden.map((h) => h.char))
  const hasGui = hiddenStemsAll.includes("癸")
  const hasBing = hiddenStemsAll.includes("丙") || pillars.some((p) => p.heavenlyStem.char === "丙")

  const genderTag = baziData.gender === "女" || baziData.gender === "female" ? "坤造" : "乾造"
  const isMale = !(baziData.gender === "女" || baziData.gender === "female")
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
    const onWheel = (e: Event) => {
      e.stopPropagation()
    }
    const onTouchStart = (e: Event) => {
      e.stopPropagation()
    }
    const onTouchMove = (e: Event) => {
      e.stopPropagation()
    }
    el.addEventListener("wheel", onWheel as any, { passive: false })
    el.addEventListener("touchstart", onTouchStart as any, { passive: false })
    el.addEventListener("touchmove", onTouchMove as any, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel as any)
      el.removeEventListener("touchstart", onTouchStart as any)
      el.removeEventListener("touchmove", onTouchMove as any)
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

  const syncIndexFromScroll = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, setIndex: (n: number) => void) => {
      const el = ref.current
      if (!el) return
      const firstBtn = el.querySelector("button") as HTMLButtonElement | null
      const itemW = firstBtn?.offsetWidth || 44
      const total = el.querySelectorAll("button").length || 0
      if (total <= 0) return
      const idx = Math.max(0, Math.min(total - 1, Math.round(el.scrollLeft / itemW)))
      setIndex(idx)
    },
    [],
  )

  // 点击时平滑滚动对齐所选项（不随滚动自动改变选中）
  const scrollToIndex = useCallback((ref: React.RefObject<HTMLDivElement | null>, index: number) => {
    const el = ref.current
    if (!el) return
    const firstBtn = el.querySelector("button") as HTMLButtonElement | null
    const itemW = firstBtn?.offsetWidth || 44
    const target = Math.max(0, index) * itemW
    el.scrollTo({ left: target, behavior: "smooth" })
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
    if (!birthInfo || !paddedDaYun.length)
      return [] as Array<{ year: number; age: string; stem: string; stemTG: string; branch: string; branchTG: string }>
    const idx = Math.min(Math.max(selectedDaYun, 0), paddedDaYun.length - 1)
    const dy = paddedDaYun[idx]
    if (!dy) return []
    const ageStart = Number.parseInt(String(dy.age).replace(/\D/g, ""), 10) || 0
    return liuNianOfSelected.map((ln: any, j: number) => ({
      year: ln.year,
      age: `${ageStart + j}岁`,
      stem: ln.stem,
      stemTG: ln.stemTG,
      branch: ln.branch,
      branchTG: ln.branchTG,
    }))
  }, [birthInfo, paddedDaYun, selectedDaYun, liuNianOfSelected])

  // 拍完盘后：根据当前年份自动选中对应大运
  useEffect(() => {
    if (!paddedDaYun.length) return
    let target = paddedDaYun.findIndex(
      (dy) =>
        typeof dy.startYear === "number" &&
        typeof dy.endYear === "number" &&
        currentYear >= (dy.startYear as number) &&
        currentYear <= (dy.endYear as number),
    )
    if (target < 0) {
      const afterIdx = paddedDaYun.findIndex((dy) => (dy.startYear as number) >= currentYear)
      target = afterIdx >= 0 ? afterIdx : paddedDaYun.length - 1
    }
    if (target < 0) target = 0
    setSelectedDaYun((prev) => (prev === target ? prev : target))
    scrollToIndex(dyScrollRef, target)
  }, [paddedDaYun, currentYear, scrollToIndex])

  // 根据当前年份自动定位所选大运的流年
  useEffect(() => {
    if (!liuNianOfSelected.length) return
    let target = liuNianOfSelected.findIndex((ln) => ln && typeof ln.year === "number" && ln.year === currentYear)
    if (target < 0) {
      let nearest = 0
      let minDiff = Number.POSITIVE_INFINITY
      liuNianOfSelected.forEach((ln, i) => {
        const diff = Math.abs((ln.year as number) - currentYear)
        if (diff < minDiff) {
          minDiff = diff
          nearest = i
        }
      })
      target = nearest
    }
    setSelectedLiuNian((prev) => (prev === target ? prev : target))
    scrollToIndex(lnScrollRef, target)
  }, [selectedDaYun, liuNianOfSelected, currentYear, scrollToIndex])

  // 流年数据绑定为“所选大运对应10年”
  const paddedLiuNian = liuNianOfSelected.length > 0 ? liuNianOfSelected : []

  const maskDateTime = (s: string) => {
    if (!privacyHidden) return s
    const parts = s.split(" ")
    if (parts.length >= 2) {
      // YYYY-MM-DD HH:mm(:ss)? -> mask time part
      const date = parts[0]
      const time = parts[1]
      const masked = time.split(":").length >= 2 ? "**:**" + (time.split(":").length === 3 ? ":**" : "") : "**:**:**"
      return `${date} ${masked}`
    }
    return s
  }
  const nameDisplay = privacyHidden ? "**" : baziData.name || "无名氏"
  const anySpiritsLong = pillars.some((p) => (p.spirits?.length ?? 0) > 3)
  return (
    <div className={compact ? "space-y-3 text-sm md:text-base" : "p-3 space-y-8 text-lg"}>
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
              <div className="font-bold text-gradient text-base md:text-lg">
                {nameDisplay}（{genderTag}）
              </div>
              <div className="text-sm md:text-base text-foreground/80">公历：{maskDateTime(baziData.solarDate)}</div>
              <div className="text-sm md:text-base text-foreground/80">农历：{maskDateTime(baziData.lunarDate)}</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex items-center justify-center size-7 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={handleCopyPro}
                aria-label="复制专业指令"
                title={copiedPro ? "已复制专业指令" : "复制专业指令"}
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center size-7 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setPrivacyHidden((v) => !v)}
                aria-label={privacyHidden ? "显示信息" : "隐藏信息"}
              >
                {privacyHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Four Pillars Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className={`w-full ${compact ? "text-sm md:text-base" : "text-base"}`}>
          <thead>
            <tr className="bg-card border-b border-border">
              <th className={`${compact ? "p-1 w-14" : "p-2"} text-center font-medium w-14`}></th>
              {compact && (
                <>
                  <th className={`${compact ? "p-1 w-14" : "p-2"} text-center font-medium w-14`}>流年</th>
                  <th className={`${compact ? "p-1 w-14" : "p-2"} text-center font-medium w-14`}>大运</th>
                  {/* 分隔列（表头占位） */}
                  <th className={`${compact ? "p-0 w-3" : "p-0"} text-center font-medium w-3`}></th>
                </>
              )}
              <th className={`${compact ? "p-1 w-14" : "p-2"} text-center font-medium w-14`}>年柱</th>
              <th className={`${compact ? "p-1 w-14" : "p-2"} text-center font-medium w-14`}>月柱</th>
              <th className={`${compact ? "p-1 w-14" : "p-2"} text-center font-medium w-14`}>
                {isMale ? "元男" : "元女"}
              </th>
              <th className={`${compact ? "p-1 w-14" : "p-2"} text-center font-medium w-14`}>时柱</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border bg-card/70">
              <td className={`${compact ? "p-0.5" : "p-3"} w-14 whitespace-nowrap text-center text-muted-foreground`}>
                主星
              </td>
              {compact && (
                <>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center`}>
                    <div className="font-bold text-foreground text-sm">{paddedLiuNian[selectedLiuNian]?.stemTG}</div>
                  </td>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center`}>
                    <div className="font-bold text-foreground text-sm">{paddedDaYun[selectedDaYun]?.stemTG}</div>
                  </td>
                  {/* 竖向虚线分隔 */}
                  <td className={`${compact ? "p-0 align-middle" : "p-0 align-middle"}`}>
                    <div className="mx-1 h-8 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? "p-0.5" : "p-3"} text-center`}>
                  <div className={`font-bold text-foreground ${compact ? "text-sm" : "text-base"}`}>
                    {p.heavenlyStem.tenGod}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/30">
              <td className={`${compact ? "p-0" : "p-3"} w-14 whitespace-nowrap text-center text-muted-foreground`}>
                天干
              </td>
              {compact && (
                <>
                  <td className={`${compact ? "p-0" : "p-3"} text-center`}>
                    <div
                      className={`font-bold leading-tight ${compact ? "text-2xl md:text-3xl" : "text-xl md:text-3xl"} ${colorifyStem(paddedLiuNian[selectedLiuNian]?.stem ?? "")}`}
                    >
                      {paddedLiuNian[selectedLiuNian]?.stem ?? ""}
                    </div>
                  </td>
                  <td className={`${compact ? "p-0" : "p-3"} text-center`}>
                    <div
                      className={`font-bold leading-tight ${compact ? "text-2xl md:text-3xl" : "text-xl md:text-3xl"} ${colorifyStem(paddedDaYun[selectedDaYun]?.stem ?? "")}`}
                    >
                      {paddedDaYun[selectedDaYun]?.stem ?? ""}
                    </div>
                  </td>
                  {/* 竖向虚线分隔 */}
                  <td className={`${compact ? "p-0 align-middle" : "p-0 align-middle"}`}>
                    <div className="mx-1 h-12 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? "p-0" : "p-3"} text-center`}>
                  <div
                    className={`font-bold leading-tight ${compact ? "text-2xl md:text-3xl" : "text-2xl md:text-3xl"} ${colorifyStem(p.heavenlyStem.char)}`}
                  >
                    {p.heavenlyStem.char}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/70">
              <td className={`${compact ? "p-0" : "p-3"} w-14 whitespace-nowrap text-center text-muted-foreground`}>
                地支
              </td>
              {compact && (
                <>
                  <td className={`${compact ? "p-0" : "p-3"} text-center`}>
                    <div
                      className={`font-bold leading-tight ${compact ? "text-2xl md:text-3xl" : "text-xl md:text-3xl"} ${colorifyBranch(paddedLiuNian[selectedLiuNian]?.branch ?? "")}`}
                    >
                      {paddedLiuNian[selectedLiuNian]?.branch ?? ""}
                    </div>
                  </td>
                  <td className={`${compact ? "p-0" : "p-3"} text-center`}>
                    <div
                      className={`font-bold leading-tight ${compact ? "text-2xl md:text-3xl" : "text-xl md:text-3xl"} ${colorifyBranch(paddedDaYun[selectedDaYun]?.branch ?? "")}`}
                    >
                      {paddedDaYun[selectedDaYun]?.branch ?? ""}
                    </div>
                  </td>
                  {/* 竖向虚线分隔 */}
                  <td className={`${compact ? "p-0 align-middle" : "p-0 align-middle"}`}>
                    <div className="mx-1 h-12 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? "p-0" : "p-3"} text-center`}>
                  <div
                    className={`font-bold leading-tight ${compact ? "text-2xl md:text-3xl" : "text-2xl md:text-3xl"} ${colorifyBranch(p.earthlyBranch.char)}`}
                  >
                    {p.earthlyBranch.char}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/30">
              <td className={`${compact ? "p-0.5" : "p-3"} w-14 whitespace-nowrap text-center text-muted-foreground`}>
                藏干
              </td>
              {compact && (
                <>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center`}>
                    <div className="h-16 flex flex-col items-center justify-center gap-0 md:gap-0.5 text-sm text-muted-foreground overflow-hidden">
                      {(paddedLiuNian[selectedLiuNian]?.hidden ?? []).map((h, j) => (
                        <div key={j} className="leading-3 md:leading-4">
                          <span className={`${colorifyStem(h.char)} font-semibold mr-0.5 md:mr-1 text-sm`}>
                            {h.char}
                          </span>
                          <span className={`font-bold text-foreground text-sm`}>{h.tenGod}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center`}>
                    <div className="h-16 flex flex-col items-center justify-center gap-0 md:gap-0.5 text-sm text-muted-foreground overflow-hidden">
                      {(paddedDaYun[selectedDaYun]?.hidden ?? []).map((h, j) => (
                        <div key={j} className="leading-3 md:leading-4">
                          <span className={`${colorifyStem(h.char)} font-semibold mr-0.5 md:mr-1 text-sm`}>
                            {h.char}
                          </span>
                          <span className={`font-bold text-foreground text-sm`}>{h.tenGod}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className={`${compact ? "p-0 align-middle" : "p-0 align-middle"}`}>
                    <div className="mx-1 h-12 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? "p-0.5" : "p-3"} text-center`}>
                  <div className="h-16 flex flex-col items-center justify-center gap-0 md:gap-0.5 overflow-hidden">
                    {p.earthlyBranch.hidden.map((h, j) => (
                      <div key={j} className={`text-sm text-muted-foreground leading-3 md:leading-4`}>
                        <span className={`${colorifyStem(h.char)} font-semibold mr-0.5 md:mr-1 text-sm`}>{h.char}</span>
                        <span className={`font-bold text-foreground text-sm`}>{h.tenGod}</span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/30">
              <td className={`${compact ? "p-0.5" : "p-3"} w-14 whitespace-nowrap text-center text-muted-foreground`}>
                星运
              </td>
              {compact && (
                <>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center text-sm`}>
                    {paddedLiuNian[selectedLiuNian]?.fortune ?? ""}
                  </td>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center text-sm`}>
                    {paddedDaYun[selectedDaYun]?.fortune ?? ""}
                  </td>
                  <td className={`${compact ? "p-0 align-middle" : "p-0 align-middle"}`}>
                    <div className="mx-1 h-8 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? "p-0.5" : "p-3"} text-center ${compact ? "text-sm" : "text-base"}`}>
                  {p.fortune}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/70">
              <td className={`${compact ? "p-0.5" : "p-3"} w-14 whitespace-nowrap text-center text-muted-foreground`}>
                自坐
              </td>
              {compact && (
                <>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center text-sm`}>
                    {paddedLiuNian[selectedLiuNian]?.selfSit ?? ""}
                  </td>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center text-sm`}>
                    {paddedDaYun[selectedDaYun]?.selfSit ?? ""}
                  </td>
                  <td className={`${compact ? "p-0 align-middle" : "p-0 align-middle"}`}>
                    <div className="mx-1 h-8 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? "p-0.5" : "p-3"} text-center ${compact ? "text-sm" : "text-base"}`}>
                  {p.selfSit}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/30">
              <td className={`${compact ? "p-0.5" : "p-3"} w-14 whitespace-nowrap text-center text-muted-foreground`}>
                空亡
              </td>
              {compact && (
                <>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center text-sm`}>
                    {paddedLiuNian[selectedLiuNian]?.voidness ?? ""}
                  </td>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center text-sm`}>
                    {paddedDaYun[selectedDaYun]?.voidness ?? ""}
                  </td>
                  <td className={`${compact ? "p-0 align-middle" : "p-0 align-middle"}`}>
                    <div className="mx-1 h-8 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? "p-0.5" : "p-3"} text-center ${compact ? "text-sm" : "text-base"}`}>
                  {p.voidness}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-card/70">
              <td className={`${compact ? "p-0.5" : "p-3"} w-14 whitespace-nowrap text-center text-muted-foreground`}>
                纳音
              </td>
              {compact && (
                <>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center text-sm`}>
                    {paddedLiuNian[selectedLiuNian]?.nayin ?? ""}
                  </td>
                  <td className={`${compact ? "p-0.5" : "p-3"} text-center text-sm`}>
                    {paddedDaYun[selectedDaYun]?.nayin ?? ""}
                  </td>
                  <td className={`${compact ? "p-0 align-middle" : "p-0 align-middle"}`}>
                    <div className="mx-1 h-8 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => (
                <td key={i} className={`${compact ? "p-0.5" : "p-3"} text-center ${compact ? "text-sm" : "text-base"}`}>
                  {p.nayin}
                </td>
              ))}
            </tr>
            <tr className="bg-card/70">
              <td
                className={`${compact ? "p-0" : "p-3"} w-14 whitespace-nowrap text-center text-muted-foreground align-top`}
              >
                <div className="inline-flex items-center justify-center gap-0.5 leading-none">
                  {isMobile && compact ? <>&nbsp;&nbsp;&nbsp;&nbsp;神煞</> : "神煞"}
                  {isMobile && compact && anySpiritsLong && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-0 h-4 w-4 text-muted-foreground"
                      onClick={() => setShowAllSpirits((v) => !v)}
                      aria-label={showAllSpirits ? "收起神煞" : "展开神煞"}
                      aria-expanded={showAllSpirits}
                      aria-controls="spirits-list"
                    >
                      {showAllSpirits ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  )}
                </div>
              </td>
              {compact && (
                <>
                  <td className={`${compact ? "p-0" : "p-3"} text-center text-sm align-top`}>
                    <div className="space-y-0.5 leading-tight text-center">
                      {(paddedLiuNian[selectedLiuNian]?.gods ?? [])
                        .slice(0, compact && isMobile && !showAllSpirits ? 1 : 999)
                        .map((g, i) => (
                          <div key={i}>{g}</div>
                        ))}
                    </div>
                  </td>
                  <td className={`${compact ? "p-0" : "p-3"} text-center text-sm align-top`}>
                    <div className="space-y-0.5 leading-tight text-center">
                      {(paddedDaYun[selectedDaYun]?.gods ?? [])
                        .slice(0, compact && isMobile && !showAllSpirits ? 1 : 999)
                        .map((g, i) => (
                          <div key={i}>{g}</div>
                        ))}
                    </div>
                  </td>
                  <td className={`${compact ? "p-0 align-middle" : "p-0 align-middle"}`}>
                    <div className="mx-1 h-6 border-r border-dashed border-border/50"></div>
                  </td>
                </>
              )}
              {pillars.map((p, i) => {
                const list = compact && isMobile && !showAllSpirits ? p.spirits.slice(0, 1) : p.spirits
                return (
                  <td
                    key={i}
                    className={`${compact ? "p-0 text-sm" : isMobile ? "p-0 text-base" : "p-3 text-base"} text-center align-top`}
                  >
                    <div className="space-y-0.5 leading-tight text-center" {...(i === 0 ? { id: "spirits-list" } : {})}>
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
        <div className="space-y-3">
          {/* 起运/交运信息 - 暂时隐藏，需要实现真实计算 */}

          {/* 大运一行（参考布局重写，美化滚动框/缩小按钮/修正选中态） */}
          <div className="border border-border rounded-md p-2">
            <div className="flex items-center gap-2">
              <div className="w-10 shrink-0 text-center leading-tight text-muted-foreground">
                <div className="text-sm">大</div>
                <div className="text-sm">运</div>
              </div>
              <div
                ref={dyScrollRef}
                className="flex-1 h-24 md:h-28 overflow-x-auto overflow-y-hidden overscroll-contain no-scrollbar rounded-lg bg-card/40 md:bg-card/50 border border-border shadow-inner snap-x snap-proximity"
                style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" as any }}
              >
                <div className="h-full inline-flex items-stretch gap-0 whitespace-nowrap">
                  {paddedDaYun.map((it, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        flushSync(() => setSelectedDaYun(idx))
                        scrollToIndex(dyScrollRef, idx)
                      }}
                      className={`w-9 md:w-11 h-full px-0.5 py-1 inline-flex flex-col items-center justify-center gap-0 leading-tight text-center select-none snap-center ${selectedDaYun === idx ? "border-2 border-secondary bg-background/40" : "border border-transparent"} ${idx > 0 ? "" : ""}`}
                    >
                      <span className="text-[10px] md:text-[11px] font-medium text-foreground/90">{it.year}</span>
                      <span className="text-[10px] md:text-[11px] text-muted-foreground">{it.age}</span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyStem(it.stem)} font-semibold text-base md:text-lg`}>{it.stem}</span>
                        <span className="text-xs md:text-sm text-foreground/80">{abbrTenGod(it.stemTG)}</span>
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyBranch(it.branch)} font-semibold text-base md:text-lg`}>
                          {it.branch}
                        </span>
                        <span className="text-xs md:text-sm text-foreground/80">{abbrTenGod(it.branchTG)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 流年一行（参考布局重写：美化滚动框/修正选中态/去除内部小框） */}
          <div className="border border-border rounded-md p-2">
            <div className="flex items-center gap-2">
              <div className="w-10 shrink-0 text-center leading-tight text-muted-foreground">
                <div className="text-sm">流</div>
                <div className="text-sm">年</div>
              </div>
              <div
                ref={lnScrollRef}
                className="flex-1 h-24 md:h-28 overflow-x-auto overflow-y-hidden overscroll-contain no-scrollbar rounded-lg bg-card/40 md:bg-card/50 border border-border shadow-inner snap-x snap-proximity"
                style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" as any }}
              >
                <div className="h-full inline-flex items-stretch gap-0 whitespace-nowrap">
                  {paddedLiuNian.map((it, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        flushSync(() => setSelectedLiuNian(idx))
                        scrollToIndex(lnScrollRef, idx)
                      }}
                      className={`w-9 md:w-11 h-full px-0.5 py-1 inline-flex flex-col items-center justify-center gap-0 leading-tight text-center select-none snap-center ${selectedLiuNian === idx ? "border-2 border-secondary bg-background/40" : "border border-transparent"} ${idx > 0 ? "" : ""}`}
                    >
                      <span className="text-[10px] md:text-[11px] font-medium text-foreground/90">{it.year}</span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyStem(it.stem)} font-semibold text-base md:text-lg`}>{it.stem}</span>
                        <span className="text-xs md:text-sm text-foreground/80">{abbrTenGod(it.stemTG)}</span>
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyBranch(it.branch)} font-semibold text-base md:text-lg`}>
                          {it.branch}
                        </span>
                        <span className="text-xs md:text-sm text-foreground/80">{abbrTenGod(it.branchTG)}</span>
                      </span>
                      {it.ganzhi && <span className="text-[10px] text-muted-foreground mt-0.5">{it.ganzhi}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 流月一行（参考布局重写：美化滚动框/修正选中态/缩小按钮） */}
          <div className="border border-border rounded-md p-2">
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
                      className={`w-9 md:w-11 h-full px-0.5 py-1 inline-flex flex-col items-center justify-center gap-0 leading-tight text-center select-none ${selectedLiuYue === idx ? "border-2 border-secondary bg-background/40" : "border border-transparent"} ${idx > 0 ? "" : ""}`}
                    >
                      <span className="text-[10px] md:text-[11px] text-foreground/90">{it.name}</span>
                      <span className="text-[10px] md:text-[11px] text-muted-foreground">{it.date}</span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyStem(it.stem)} font-semibold text-base md:text-lg`}>{it.stem}</span>
                        <span className="text-xs md:text-sm text-foreground/80">{it.stemTG}</span>
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        <span className={`${colorifyBranch(it.branch)} font-semibold text-base md:text-lg`}>
                          {it.branch}
                        </span>
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
              <div className="font-medium">{hasGui ? "藏于地支" : "缺少"}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">丙</div>
              <div className="font-medium">{hasBing ? "不缺" : "缺少"}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            您八字里存在能调节气候的能量，但力量稍弱，需要外界助力（如特定的人、环境或时机）才能达到最舒适的状态。这意味着您的才能需要被“赏识”或“激活”，方能完全施展。
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            您的八字格局偏向{coldWarm === "偏寒" ? "寒湿" : coldWarm === "偏热" ? "燥热" : "平和"}，建议多接触
            {coldWarm === "偏寒" ? "阳光、运动" : coldWarm === "偏热" ? "水与静心" : "适度的自然四时"}
            ，以取得更佳的内外平衡。
          </p>
          <Button variant="ghost" size="sm" className="w-full text-sm">
            问万象AI
          </Button>
        </div>
      )}
    </div>
  )
}
