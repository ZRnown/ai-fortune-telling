import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "张女士",
    location: "北京",
    rating: 5,
    content:
      "测算结果非常准确，特别是对我性格的分析，简直就像认识我多年的朋友。事业建议也很有参考价值，帮助我做出了正确的职业选择。",
  },
  {
    name: "李先生",
    location: "上海",
    rating: 5,
    content: "一直对传统文化感兴趣，天机阁将AI与易学结合得很好。报告详细专业，而且界面设计很有品味，体验非常好。",
  },
  {
    name: "王女士",
    location: "深圳",
    rating: 5,
    content: "姻缘配对服务帮了大忙！和男友的八字分析让我们更了解彼此，也学会了如何更好地相处。感谢天机阁的专业服务。",
  },
]

export function Testimonials() {
  return (
    <section className="py-12 md:py-16 lg:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-3 md:mb-4 tracking-wide">用户评价</h2>
          <div className="w-12 md:w-16 h-px bg-secondary mx-auto mb-4 md:mb-6" />
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto px-2">听听他们的真实体验</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-5 md:p-6 lg:p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-0.5 md:gap-1 mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6 font-light">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-2 md:gap-3 pt-3 md:pt-4 border-t border-border">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm md:text-base text-secondary font-normal">{testimonial.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm md:text-base font-normal truncate">{testimonial.name}</div>
                  <div className="text-xs md:text-sm text-muted-foreground font-light">{testimonial.location}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
