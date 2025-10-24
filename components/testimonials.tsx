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
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-light mb-4 tracking-wide">用户评价</h2>
          <div className="w-16 h-px bg-secondary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto">听听他们的真实体验</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6 font-light">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="text-secondary font-normal">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-normal">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground font-light">{testimonial.location}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
