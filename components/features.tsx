import { Shield, Zap, Lock, Clock } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "AI智能算法",
    description: "深度学习模型结合传统命理，提供更精准的分析结果",
  },
  {
    icon: Shield,
    title: "专业可靠",
    description: "资深命理师团队监督，确保每一份报告的专业性",
  },
  {
    icon: Lock,
    title: "隐私保护",
    description: "采用银行级加密技术，您的个人信息绝对安全",
  },
  {
    icon: Clock,
    title: "即时生成",
    description: "无需等待，输入信息后即可获得详细的命理报告",
  },
]

export function Features() {
  return (
    <section className="py-12 md:py-16 lg:py-24 px-4 md:px-6 bg-muted/30 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-3 md:mb-4 tracking-wide px-2">为什么选择万象</h2>
          <div className="w-12 md:w-16 h-px bg-secondary mx-auto mb-4 md:mb-6" />
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto px-2">
            传统与科技的完美融合，为您带来前所未有的命理体验
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="mb-3 md:mb-4 lg:mb-6 flex justify-center">
                <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-background border-2 border-border flex items-center justify-center group-hover:border-secondary transition-colors">
                  <feature.icon className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-secondary" />
                </div>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-normal mb-1.5 md:mb-2 lg:mb-3 tracking-wide px-1">{feature.title}</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed font-light px-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
