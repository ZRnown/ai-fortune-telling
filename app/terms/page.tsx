"use client"

import { TopBar } from "@/components/topbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gradient">天乙神算 用户协议</h1>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>更新日期：2025年7月15日</p>
            <p>生效日期：2025年7月15日</p>
          </div>
        </div>

        <Card className="p-6 sm:p-8 shadow-lg">
          <ScrollArea className="h-[600px] sm:h-[700px] pr-4">
            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
              
              <div className="mb-8 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-base leading-relaxed">
                  亲爱的用户，欢迎您使用天乙神算产品及服务！
                </p>
                <p className="mt-3 text-sm leading-relaxed">
                  天乙神算产品及服务由昆仑墟（上海）网络科技有限公司（以下简称"我们"）共同所有和负责运营。在使用本服务前，请您务必仔细阅读并理解本《天乙神算用户协议》（以下简称"本协议"）以及本平台的其他相关协议、政策或指引。
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">1. 服务内容</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">1.1 服务范围</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      我们的产品及服务包括我们以网页、应用程序（可能含不同版本）、小程序、供第三方网站和应用程序使用软件开发工具包（SDK）、应用程序编程接口（API）以及随技术发展出现的创新形态方式向您提供的产品与服务，包括但不限于以生成式人工智能服务为核心功能以及其他功能的平台（以下称"天乙神算"或"本服务"）。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">1.2 技术基础</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      我们提供的生成式人工智能产品和服务以天乙神算 Chat大语言模型为基础。天乙神算 Chat大语言模型基于深度神经网络算法，依次经过大规模自监督学习的预训练以及针对性的优化训练等阶段开发而成，该模型可以通过对输入信息（包括文本、图片、文件等）进行编码和计算来预测下一个词元，从而具备文本生成和对话等能力。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">1.3 服务调整</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      随着生成式人工智能的技术、模型和产品的不断迭代发展以及法律、法规的变化，我们可能对服务进行新增、升级、变更、中止或终止，或对服务的技术、方式、性能等进行必要的调整。
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">2. 账号管理</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">2.1 年龄限制</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      本服务主要面向成年人。如果您未满18周岁，请在法定监护人陪同下阅读本协议，并在征得法定监护人的同意后使用本服务。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">2.2 账号注册</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      您在使用本服务前，应根据页面通过手机号码或第三方账号注册账号，按要求填写真实、准确、合法、有效的相关信息。您的账号是您登录及使用本服务的凭证，该账号不可转让、不可赠与、不可继承。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">2.3 用户承诺</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>对注册信息的真实性、合法性、有效性承担全部责任</li>
                      <li>妥善保管账号及密码，并对该账号项下的所有行为承担法律责任</li>
                      <li>不得恶意注册账号，包括但不限于频繁注册、批量注册等行为</li>
                      <li>不得以任何形式将账号转让、出借、出租或提供给他人使用</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">3. 使用规范</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">3.1 授权范围</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      您充分理解并同意，依据本协议，我们授予您一项可撤销的、不可转让的和非独占地的合法使用本产品及相关服务的权利。如果您对外发布或传播本服务生成的输出，您应当主动核查输出内容的真实性、准确性，避免传播虚假信息。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">3.2 禁止行为</h3>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      您不得违反相关法律法规，不得输入、利用本服务输出或传播以下违法不良信息：
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                      <li>反对宪法所确定的基本原则的</li>
                      <li>危害国家安全，泄露国家秘密的</li>
                      <li>散布谣言，扰乱经济秩序和社会秩序的</li>
                      <li>散布淫秽、色情、赌博、暴力等内容</li>
                      <li>侮辱或者诽谤他人，侵害他人合法权益的</li>
                      <li>法律、行政法规禁止的其他内容</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">4. 输入与输出</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">4.1 用户责任</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      您对提交给我们服务的所有输入和对应的输出负责。您声明并保证您向我们的服务提交的输入不侵犯任何人的知识产权、肖像权、名誉权等合法权益。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">4.2 内容权利</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      在符合法律规定和我们的条款的条件下，您保留在提交的输入中拥有的任何权利，我们将本服务输出的内容的任何权利和所有权归属于您。
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                    <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-200">4.4 免责声明</h3>
                    <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
                      本服务提供的所有输出均由人工智能模型答复，可能出现错误或遗漏，仅供您参考。特别的，当您在使用本服务咨询医疗、法律、金融及其他专业问题时，请注意本服务不构成任何建议或承诺。若您需要相关专业服务，应咨询专业人士。
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">5. 知识产权和其他权利</h2>
                <p className="text-muted-foreground leading-relaxed">
                  天乙神算为本服务的开发、运营主体，对本服务（包括但不限于软件、技术、程序、代码、模型权重、用户界面、网页、文字、图表、版面设计、商标、电子文档等）享有法律法规允许范围内的全部权利。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">6. 投诉反馈</h2>
                <p className="text-muted-foreground leading-relaxed">
                  如果您认为本服务涉及侵害您知识产权或其他权利的，或者您发现任何违法、虚假信息以及违反本协议的使用行为，可以通过产品界面点击"联系我们"按钮进行提交，或通过联系邮箱 <a href="mailto:service@klxtech.com" className="text-primary hover:underline">service@klxtech.com</a> 向我们进行反馈。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">7. 违约责任与责任限制</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  针对您违反本协议或其他服务条款的行为，我们有权独立判断，无需通知对您采取警示提醒、限期改正、限制账号功能、暂停使用、关闭账号等处置措施。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  我们致力于提供安全、稳定、持续的服务，但本服务仅以"现状"、"当前功能"的状态提供。由于技术本身存在的技术瓶颈和科技客观限制，我们不能对服务的持续稳定、内容的准确性等作出保证。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">8. 法律适用和管辖</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本协议的订立、执行和解释及争议的解决均应适用中华人民共和国大陆地区法律。本协议的签订、履行或解释发生争议，双方应努力友好协商解决。
                </p>
              </section>

              <section className="mb-4">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">9. 其他</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  为向您提供更好的服务或为了满足国家法律法规、政策调整，技术条件、产品功能等变化的需要，我们会适时对本协议进行修订。更新后的协议将通过官方网站或服务页面等适当的方式进行公示。
                </p>
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm font-semibold mb-2">联系方式：</p>
                  <p className="text-sm text-muted-foreground">联系邮箱：service@klxtech.com</p>
                </div>
              </section>

            </div>
          </ScrollArea>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
