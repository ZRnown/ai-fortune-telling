"use client"

import type React from "react"

import { useState } from "react"
// import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { TopBar } from "@/components/topbar"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 登录表单状态
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  // 注册表单状态
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 模拟登录
    setTimeout(() => {
      // 模拟成功登录
      localStorage.setItem("user", JSON.stringify({ email: loginForm.email, username: "用户", membership: "free" }))
      // 设置基础鉴权 Cookie（演示用途）
      document.cookie = `token=${encodeURIComponent(loginForm.email)}; path=/; max-age=${7 * 24 * 60 * 60}`
      setIsLoading(false)
      router.push("/profile")
    }, 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("两次输入的密码不一致")
      return
    }

    setIsLoading(true)

    // 模拟注册
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email: registerForm.email, username: registerForm.username, membership: "free" }))
      // 设置基础鉴权 Cookie（演示用途）
      document.cookie = `token=${encodeURIComponent(registerForm.email)}; path=/; max-age=${7 * 24 * 60 * 60}`
      setIsLoading(false)
      router.push("/profile")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar subtitle="登录 / 注册" />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-md p-6 md:p-8 bg-card/50 backdrop-blur-sm">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">欢迎来到万象</h2>
            <p className="text-sm md:text-base text-muted-foreground">登录或注册以开始您的命理之旅</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>

            {/* 登录表单 */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">邮箱</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">记住我</span>
                  </label>
                  <button type="button" className="text-primary hover:underline">
                    忘记密码？
                  </button>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "登录中..." : "登录"}
                </Button>
              </form>
            </TabsContent>

            {/* 注册表单 */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">用户名</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="您的用户名"
                      className="pl-10"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">邮箱</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">确认密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "注册中..." : "注册"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  注册即表示您同意我们的
                  <button type="button" className="text-primary hover:underline mx-1">
                    服务条款
                  </button>
                  和
                  <button type="button" className="text-primary hover:underline mx-1">
                    隐私政策
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  )
}
