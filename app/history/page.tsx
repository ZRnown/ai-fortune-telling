"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User } from "lucide-react"
import { TopBar } from "@/components/topbar"

export default function HistoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // 检查登录状态
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    }
  }, [router])

  // 模拟排盘历史数据
  const allHistory = [
    { id: 1, type: "八字命理", date: "2025-01-15 14:30", name: "张三", gender: "男" },
    { id: 2, type: "六爻占卜", date: "2025-01-14 10:20", name: "李四", gender: "女" },
    { id: 3, type: "八字命理", date: "2025-01-13 16:45", name: "王五", gender: "男" },
    { id: 4, type: "六爻占卜", date: "2025-01-12 09:15", name: "赵六", gender: "女" },
    { id: 5, type: "八字命理", date: "2025-01-11 20:30", name: "孙七", gender: "男" },
  ]

  const filteredHistory = allHistory.filter(
    (item) => item.name.includes(searchQuery) || item.type.includes(searchQuery) || item.date.includes(searchQuery),
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar subtitle="排盘历史" />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">排盘历史</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜索姓名、类型或日期..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <Card
                key={item.id}
                className="p-4 md:p-6 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer"
                onClick={() => router.push(`/reading?id=${item.id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded">
                          {item.gender}
                        </span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full md:w-auto bg-transparent">
                    查看详情
                  </Button>
                </div>
              </Card>
            ))}

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">没有找到相关记录</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
