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
    <section className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-light mb-4 tracking-wide">专业测算服务</h2>
          <div className="w-16 h-px bg-secondary mx-auto mb-6" />
          <p className="text-muted-foreground text-base md:text-lg font-light max-w-2xl mx-auto px-4">
            传承千年智慧，运用现代科技，为您提供精准专业的命理咨询
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-6 md:p-8 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <service.icon className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-2xl font-normal mb-2 md:mb-3 tracking-wide">{service.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed font-light">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs md:text-sm px-2 md:px-3 py-1 rounded-full bg-muted text-muted-foreground font-light"
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
