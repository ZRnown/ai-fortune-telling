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
    <section className="py-24 px-6 bg-muted/30 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-light mb-4 tracking-wide">为什么选择天机阁</h2>
          <div className="w-16 h-px bg-secondary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto">
            传统与科技的完美融合，为您带来前所未有的命理体验
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-background border-2 border-border flex items-center justify-center group-hover:border-secondary transition-colors">
                  <feature.icon className="w-10 h-10 text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-normal mb-3 tracking-wide">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
