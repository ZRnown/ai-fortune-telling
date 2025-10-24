"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, Crown, Settings, ExternalLink } from "lucide-react"
import { TopBar } from "@/components/topbar"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  // 会员信息来自本地用户对象

  useEffect(() => {
    // 检查登录状态
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    // 清理基础鉴权 Cookie（演示用途）
    document.cookie = "token=; path=/; max-age=0"
    router.push("/")
  }

  // 模拟排盘历史数据
  const history = [
    { id: 1, type: "八字命理", date: "2025-01-15 14:30", name: "张三" },
    { id: 2, type: "六爻占卜", date: "2025-01-14 10:20", name: "李四" },
    { id: 3, type: "八字命理", date: "2025-01-13 16:45", name: "王五" },
  ]

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar subtitle="个人中心" />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* User Info Card */}
          <Card className="p-6 md:p-8 mb-6 bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary/20 flex items-center justify-center">
                <User className="w-10 h-10 md:w-12 md:h-12 text-secondary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{user.username || "用户"}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-secondary" />
                    <span className="text-lg font-medium">会员类型：{user.membership || "free"}</span>
                  </div>
                  <Link href="/membership" className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      查看会员权益
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Settings Only */}
          <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg md:text-xl font-bold">账户设置</h3>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">修改个人信息</Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">修改密码</Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">通知设置</Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">隐私设置</Button>
              <Button variant="destructive" className="w-full" onClick={handleLogout}>退出登录</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
