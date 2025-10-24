import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold text-gradient mb-4">万象</div>
            <p className="text-muted-foreground font-light leading-relaxed max-w-md">
              融合千年易学智慧与现代AI科技，为您揭示命运玄机，指引人生方向。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-normal mb-4 tracking-wide">服务项目</h3>
            <ul className="space-y-2 text-muted-foreground font-light">
              <li>
                <Link href="/calculate" className="hover:text-foreground transition-colors">
                  八字命理
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  紫微斗数
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  姻缘配对
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  事业财运
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-normal mb-4 tracking-wide">关于我们</h3>
            <ul className="space-y-2 text-muted-foreground font-light">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  公司介绍
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  隐私政策
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  服务条款
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  联系我们
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground font-light">
          <p>© 2025 万象 AI智能算命. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}
