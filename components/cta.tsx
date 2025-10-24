import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-background to-accent/5" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-wide text-balance">开启您的命理之旅</h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            输入您的生辰信息，让AI为您揭示命运的奥秘
          </p>
        </div>

        {/* Form */}
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-8 md:p-12 shadow-xl text-center">
          <div className="mb-6">
            <div className="text-lg text-muted-foreground mb-8 font-light leading-relaxed">
              我们提供专业的八字命理分析服务
              <br />
              准确率高达98%，已为100万+用户提供服务
            </div>
          </div>

          <Link href="/calculate">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg font-normal tracking-wide"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              立即开始测算
            </Button>
          </Link>

          <p className="text-center text-sm text-muted-foreground mt-6 font-light">
            您的隐私将受到严格保护 · 所有数据均加密存储
          </p>
        </div>
      </div>
    </section>
  )
}
