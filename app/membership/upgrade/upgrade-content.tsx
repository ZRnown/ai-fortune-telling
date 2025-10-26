"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const VALID_TIERS = ["pro", "premium"] as const

type Tier = (typeof VALID_TIERS)[number]

export default function UpgradeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const initialTier = (params.get("tier") as Tier) || "pro"
  const [tier, setTier] = useState<Tier>(initialTier)

  const tierInfo = useMemo(() => {
    const map: Record<Tier, { name: string; price: string; desc: string }> = {
      pro: { name: "进阶会员", price: "¥29/月", desc: "AI 智能解读、真太阳时标注、历史云端保存等" },
      premium: { name: "专业会员", price: "¥69/月", desc: "AI 深度解读、流年大运分析、专属客服等" },
    }
    return map[tier]
  }, [tier])

  useEffect(() => {
    if (!VALID_TIERS.includes(initialTier)) {
      setTier("pro")
    }
  }, [initialTier])

  const confirmUpgrade = () => {
    try {
      const userStr = localStorage.getItem("user")
      if (!userStr) {
        router.push("/login?redirect=/membership/upgrade?tier=" + tier)
        return
      }
      const user = JSON.parse(userStr)
      user.membership = tier
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/profile")
    } catch {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-xl mx-auto">
        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">确认升级</h1>
          <div className="text-muted-foreground">请选择要升级的会员档位，并确认操作</div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant={tier === "pro" ? "default" : "outline"} onClick={() => setTier("pro")}>进阶会员</Button>
            <Button variant={tier === "premium" ? "default" : "outline"} onClick={() => setTier("premium")}>专业会员</Button>
          </div>

          <div className="border rounded-md p-4">
            <div className="text-lg font-semibold mb-1">{tierInfo.name}</div>
            <div className="text-secondary mb-2">{tierInfo.price}</div>
            <div className="text-sm text-muted-foreground">{tierInfo.desc}</div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={confirmUpgrade}>确认升级</Button>
            <Button className="flex-1" variant="outline" onClick={() => router.back()}>返回</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
