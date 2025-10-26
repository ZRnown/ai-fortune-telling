import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden px-4 py-16 md:py-0">
      {/* Decorative Elements - More visible on mobile */}
      <div className="absolute top-10 md:top-20 left-4 md:left-10 w-20 h-20 md:w-32 md:h-32 opacity-5 md:opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-secondary">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="absolute bottom-10 md:bottom-20 right-4 md:right-10 w-24 h-24 md:w-40 md:h-40 opacity-5 md:opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-secondary">
          <path d="M50 10 L90 90 L10 90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Logo/Brand */}
        <div className="mb-6 md:mb-8 flex justify-center">
          <div className="relative">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider text-gradient">
              万象
            </div>
            <div className="absolute -bottom-1 md:-bottom-2 left-1/2 -translate-x-1/2 w-20 md:w-32 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-3 md:mb-4 tracking-wide font-light">
          AI Intelligence · Ancient Wisdom
        </p>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light mb-4 md:mb-6 lg:mb-8 leading-tight tracking-wide text-balance px-2">
          千年易学智慧
          <br />
          <span className="font-normal">遇见现代科技</span>
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 lg:mb-12 leading-relaxed font-light px-2">
          融合周易八卦、六爻占卜与先进AI算法
          <br className="hidden sm:block" />
          为您揭示命运玄机，指引人生方向
        </p>

        <div className="flex justify-center items-center px-4">
          <Link href="/calculate" className="w-full sm:w-auto max-w-xs">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 md:px-12 py-5 md:py-6 lg:py-7 text-base md:text-lg font-normal tracking-wide w-full shadow-lg shadow-primary/20"
            >
              <Sparkles className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              开始测算
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-10 md:mt-12 lg:mt-20 grid grid-cols-3 gap-3 md:gap-8 max-w-3xl mx-auto px-2">
          <div className="text-center py-3 md:py-0">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-secondary mb-1 md:mb-2">
              100万+
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground tracking-wide">用户信赖</div>
          </div>
          <div className="text-center border-x border-border py-3 md:py-0">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-secondary mb-1 md:mb-2">
              98%
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground tracking-wide">准确率</div>
          </div>
          <div className="text-center py-3 md:py-0">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-secondary mb-1 md:mb-2">
              24/7
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground tracking-wide">在线服务</div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 md:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
