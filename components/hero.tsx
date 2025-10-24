import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-10 hidden md:block">
        <svg viewBox="0 0 100 100" className="w-full h-full text-secondary">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 w-40 h-40 opacity-10 hidden md:block">
        <svg viewBox="0 0 100 100" className="w-full h-full text-secondary">
          <path d="M50 10 L90 90 L10 90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Logo/Brand */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider text-gradient">万象</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-4 tracking-wide font-light">
          AI Intelligence · Ancient Wisdom
        </p>

        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-light mb-6 md:mb-8 leading-tight tracking-wide text-balance px-4">
          千年易学智慧
          <br />
          <span className="font-normal">遇见现代科技</span>
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed font-light px-4">
          融合周易八卦、六爻占卜与先进AI算法，
          <br className="hidden md:block" />
          为您揭示命运玄机，指引人生方向
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <Link href="/calculate">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-normal tracking-wide w-full sm:w-auto"
            >
              <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              开始测算
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-2 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-light tracking-wide bg-transparent w-full sm:w-auto"
          >
            了解更多
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-12 md:mt-20 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-secondary mb-2">100万+</div>
            <div className="text-xs md:text-sm text-muted-foreground tracking-wide">用户信赖</div>
          </div>
          <div className="text-center border-x border-border">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-secondary mb-2">98%</div>
            <div className="text-xs md:text-sm text-muted-foreground tracking-wide">准确率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-secondary mb-2">24/7</div>
            <div className="text-xs md:text-sm text-muted-foreground tracking-wide">在线服务</div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
