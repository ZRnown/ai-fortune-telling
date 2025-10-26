"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Globe, User, Crown } from "lucide-react"
import { isLoggedIn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TopBarProps {
  subtitle?: string
}

export function TopBar({ subtitle }: TopBarProps) {
  const router = useRouter()
  const [language, setLanguage] = useState("zh")

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h1
                  className="text-2xl font-bold text-gradient select-none cursor-pointer"
                  onClick={() => router.push('/calculate')}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') router.push('/calculate')
                  }}
                  aria-label="前往排盘"
                >
                  万象
                </h1>
              </TooltipTrigger>
              <TooltipContent>前往排盘</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {subtitle ? <span className="text-sm text-muted-foreground hidden md:inline">{subtitle}</span> : null}
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger
                      aria-label="切换语言"
                      className="w-9 h-9 px-0 justify-center border rounded-md hover:bg-input/50 dark:hover:bg-input/50 transition-colors"
                    >
                      <Globe className="h-5 w-5 text-foreground" aria-hidden="true" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>语言</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/membership")}
                  aria-label="会员"
                >
                  <Crown className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>会员</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (isLoggedIn()) router.push("/history")
                    else router.push("/login")
                  }}
                  aria-label="排盘历史"
                >
                  <History className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>排盘历史</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push(isLoggedIn() ? "/profile" : "/login")}
                  aria-label="用户"
                >
                  <User className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>用户</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}
