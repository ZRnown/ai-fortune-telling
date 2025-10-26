import { Card } from "@/components/ui/card"
import { Compass, Star, Heart, Briefcase } from "lucide-react"

const services = [
  {
    icon: Compass,
    title: "八字命理",
    description: "根据生辰八字，解析五行命格，洞悉一生运势起伏",
    features: ["命格分析", "五行平衡", "大运流年"],
  },
  {
    icon: Star,
    title: "六爻占卜",
    description: "古法六爻起卦，预测吉凶祸福，指引人生方向",
    features: ["卦象解析", "动爻变化", "世应关系"],
  },
  {
    icon: Heart,
    title: "姻缘配对",
    description: "分析双方八字契合度，预测感情发展与婚姻走向",
    features: ["缘分指数", "性格匹配", "婚姻建议"],
  },
  {
    icon: Briefcase,
    title: "事业财运",
    description: "洞察事业发展方向，把握财富机遇与投资时机",
    features: ["职业规划", "财运分析", "贵人方位"],
  },
]

export function Services() {
  return (
    <section className="py-12 md:py-16 lg:py-24 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-3 md:mb-4 tracking-wide">专业测算服务</h2>
          <div className="w-12 md:w-16 h-px bg-secondary mx-auto mb-4 md:mb-6" />
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto px-2">
            传承千年智慧，运用现代科技，为您提供精准专业的命理咨询
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-5 md:p-6 lg:p-8 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group"
            >
              <div className="flex items-start gap-3 md:gap-4 lg:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <service.icon className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-secondary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal mb-1.5 md:mb-2 lg:mb-3 tracking-wide">{service.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-2.5 md:mb-3 lg:mb-4 leading-relaxed font-light">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] sm:text-xs md:text-sm px-2 md:px-2.5 lg:px-3 py-0.5 md:py-1 rounded-full bg-muted text-muted-foreground font-light"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
