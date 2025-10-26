"use client"

import { TopBar } from "@/components/topbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Lock, Eye, Database, UserCheck, Bell } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gradient">天乙神算 隐私政策</h1>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>更新日期：2025年7月15日</p>
            <p>生效日期：2025年7月15日</p>
          </div>
        </div>

        <Card className="p-6 sm:p-8 shadow-lg">
          <ScrollArea className="h-[600px] sm:h-[700px] pr-4">
            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
              
              <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-base leading-relaxed">
                  昆仑墟（上海）网络科技有限公司（以下简称"我们"）深知个人信息对您的重要性，我们将按照法律法规的规定，保护您的个人信息及隐私安全。我们制定本《隐私政策》并特别提示：
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  希望您在使用天乙神算及相关服务前仔细阅读并理解本政策，以便做出适当的选择。
                </p>
              </div>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">1. 我们如何收集和使用您的个人信息</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">1.1 注册和登录</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      当您注册、登录天乙神算及相关服务时，您可以通过手机号创建账号，我们将通过发送短信验证码的方式来验证您的身份是否有效。您还可以使用第三方账号（如微信、QQ等）登录，我们将获取您授权共享的账号信息（头像、昵称等）。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">1.2 服务使用</h3>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      在您使用我们的服务过程中，我们会收集以下信息：
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                      <li><strong>输入信息：</strong>您向AI模型提交的文本、图片等内容</li>
                      <li><strong>生成内容：</strong>AI模型根据您的输入生成的响应内容</li>
                      <li><strong>使用记录：</strong>服务使用时间、频次、功能使用情况等</li>
                      <li><strong>设备信息：</strong>设备型号、操作系统、浏览器类型、IP地址等</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">1.3 支付信息</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      当您购买付费服务时，我们会收集您的订单信息。支付功能由第三方支付机构提供，我们不会收集您的银行卡号、密码等敏感支付信息。
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-green-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">2. 我们如何保护您的个人信息</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    我们非常重视您的个人信息安全，采取了符合业界标准的安全措施来保护您的个人信息：
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <h4 className="font-semibold mb-2 text-sm">数据加密</h4>
                      <p className="text-xs text-muted-foreground">使用SSL/TLS加密传输，确保数据传输安全</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <h4 className="font-semibold mb-2 text-sm">访问控制</h4>
                      <p className="text-xs text-muted-foreground">严格的权限管理，仅授权人员可访问</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <h4 className="font-semibold mb-2 text-sm">安全审计</h4>
                      <p className="text-xs text-muted-foreground">定期进行安全评估和漏洞扫描</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <h4 className="font-semibold mb-2 text-sm">数据备份</h4>
                      <p className="text-xs text-muted-foreground">定期备份，防止数据丢失</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">3. 我们如何使用Cookie和同类技术</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    为确保网站正常运转、为您获得更轻松的访问体验，我们会在您的设备上存储Cookie、Flash Cookie或浏览器提供的其他本地存储（统称"Cookie"）。
                  </p>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Cookie的用途</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                      <li>记住您的登录状态</li>
                      <li>分析您使用我们服务的情况，以优化服务体验</li>
                      <li>防范安全风险</li>
                    </ul>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    您可以通过浏览器设置管理或删除Cookie。但请注意，如果停用Cookie，您可能无法享受最佳的服务体验。
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">4. 您的权利</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    按照中国相关的法律法规，我们保障您对自己的个人信息行使以下权利：
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <h4 className="font-semibold mb-1 text-sm">访问权</h4>
                      <p className="text-xs text-muted-foreground">您有权访问您的个人信息</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <h4 className="font-semibold mb-1 text-sm">更正权</h4>
                      <p className="text-xs text-muted-foreground">您有权更正您的个人信息</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <h4 className="font-semibold mb-1 text-sm">删除权</h4>
                      <p className="text-xs text-muted-foreground">您有权要求我们删除您的个人信息</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <h4 className="font-semibold mb-1 text-sm">注销权</h4>
                      <p className="text-xs text-muted-foreground">您有权注销您的账号</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-red-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">5. 本政策如何更新</h2>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  我们可能适时修订本政策内容。如该等变更会导致您在本政策项下权利的实质减损，我们将在变更生效前，通过在页面显著位置提示、向您发送电子邮件等方式通知您。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">6. 未成年人保护</h2>
                <p className="text-muted-foreground leading-relaxed">
                  我们非常重视对未成年人个人信息的保护。若您是18周岁以下的未成年人，在使用我们的服务前，应事先取得您的家长或法定监护人的同意。
                </p>
              </section>

              <section className="mb-4">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">7. 如何联系我们</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  如果您对本隐私政策有任何疑问、意见或建议，或您在使用我们的服务时遇到任何问题，请通过以下方式与我们联系：
                </p>
                <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-2">
                  <p className="text-sm"><strong>公司名称：</strong>昆仑墟（上海）网络科技有限公司</p>
                  <p className="text-sm"><strong>联系邮箱：</strong><a href="mailto:service@klxtech.com" className="text-primary hover:underline">service@klxtech.com</a></p>
                  <p className="text-sm text-muted-foreground">我们将在15个工作日内回复您的请求</p>
                </div>
              </section>

            </div>
          </ScrollArea>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
