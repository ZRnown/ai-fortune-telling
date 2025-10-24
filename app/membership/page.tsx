"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Crown, Star, Gem } from "lucide-react"
import { TopBar } from "@/components/topbar"

type Tier = {
  key: "free" | "pro" | "premium"
  name: string
  icon: React.ComponentType<any>
  price: string
  period: string
  features: string[]
  cta: { label: string; href: string }
  highlighted?: boolean
}

export default function MembershipPage() {
  const tiers: Tier[] = [
    {
      key: "free",
      name: "免费会员",
      icon: Star,
      price: "¥0",
      period: "/永久",
      features: [
        "不限次数排盘（基础版）",
        "基础八字/六爻展示",
        "社区基础支持",
      ],
      cta: { label: "当前权益", href: "/" },
    },
    {
      key: "pro",
      name: "进阶会员",
      icon: Crown,
      price: "¥29",
      period: "/月",
      features: [
        "AI 智能解读（标准版）",
        "生辰校对与节气真太阳时标注",
        "历史记录云端保存",
        "优先问题反馈通道",
      ],
      cta: { label: "立即升级", href: "/membership/upgrade?tier=pro" },
      highlighted: true,
    },
    {
      key: "premium",
      name: "专业会员",
      icon: Gem,
      price: "¥69",
      period: "/月",
      features: [
        "AI 深度解读（专业版）",
        "流年/大运/运势对比分析",
        "六爻变卦细节推演",
        "专属客服与1对1顾问窗口",
      ],
      cta: { label: "立即升级", href: "/membership/upgrade?tier=premium" },
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar subtitle="会员中心" />

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <section className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">解锁更专业的命理解读</h2>
            <p className="text-muted-foreground">按需选择合适的会员档位，获得更准确、更深入的 AI 解读与专业服务</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {tiers.map((tier) => {
              const Icon = tier.icon
              return (
                <Card
                  key={tier.key}
                  className={`p-6 md:p-8 bg-card/50 backdrop-blur-sm border ${
                    tier.highlighted ? "border-secondary/50 ring-1 ring-secondary/30" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-5 w-5 text-secondary" />
                    <div className="text-xl font-semibold">{tier.name}</div>
                  </div>
                  <div className="flex items-end gap-2 mb-6">
                    <div className="text-3xl md:text-4xl font-bold">{tier.price}</div>
                    <div className="text-muted-foreground mb-1">{tier.period}</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-secondary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={tier.cta.href} className="block">
                    <Button className="w-full" variant={tier.highlighted ? "default" : "outline"}>
                      {tier.cta.label}
                    </Button>
                  </Link>
                </Card>
              )
            })}
          </div>

          <section className="mt-10 md:mt-14">
            <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm">
              <h3 className="text-lg md:text-xl font-bold mb-4">常见问题</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>· 会员按月订阅，随时可取消，取消后到期前仍可继续使用对应权益。</p>
                <p>· 免费会员可不限次数基础排盘，进阶/专业会员可获得 AI 解读与更多高级功能。</p>
                <p>· 如需协助或商务合作，请联系官网底部的客服渠道。</p>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
