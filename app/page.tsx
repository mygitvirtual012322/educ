import { GovHeader } from "@/components/GovHeader";
import { BenefitCard } from "@/components/BenefitCard";
import { ArrowRight, CheckCircle2, School, ShoppingBag, Users, Calendar, FileText, Shield, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PulsingButton } from "@/components/PulsingButton";
import { GovFooter } from "@/components/GovFooter";
import { TestimonialsSection } from "@/components/TestimonialsSection";

import { PartnerCarousel } from "@/components/PartnerCarousel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <GovHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gov-blue-800 via-gov-blue-900 to-gov-blue-900 pb-20 pt-16 md:pb-32 md:pt-24">
          <div className="container-centered relative z-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="lg:col-span-6 flex flex-col text-center lg:text-left text-white">
                <ScrollReveal animation="fade-up" delay={0.1}>
                  <div className="inline-flex items-center gap-2 self-center lg:self-start bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                    <span className="h-2 w-2 rounded-full bg-gov-yellow-400 animate-pulse"></span>
                    <span className="text-xs font-semibold uppercase tracking-wide">Vigente desde Janeiro/2026</span>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={0.2}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-balance leading-tight">
                    Garanta o material escolar com o <span className="text-gov-yellow-400">Cartão Futuro Escolar</span>
                  </h1>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={0.3}>
                  <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0 text-balance leading-relaxed">
                    O Governo Federal liberou <strong className="text-white">R$ 350,00 por filho</strong> para compra de materiais escolares. Verifique a disponibilidade e solicite seu cartão hoje mesmo.
                  </p>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={0.4}>


                  <p className="mt-6 text-sm text-blue-200">
                    * Disponível para famílias inscritas no CadÚnico. Consulta grátis.
                  </p>
                </ScrollReveal>
              </div>

              {/* Right Column - Card Showcase */}
              <div className="mt-16 lg:mt-0 lg:col-span-6 relative flex flex-col items-center justify-center">
                <ScrollReveal animation="fade-in" delay={0.5}>
                  {/* EducaBank Logo */}
                  <div className="mb-8">
                    <img
                      src="/educabank.png"
                      alt="EducaBank"
                      className="h-16 w-auto drop-shadow-2xl"
                    />
                  </div>

                  {/* Card Container with 3D Effect */}
                  <div className="relative group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gov-yellow-400/20 rounded-3xl blur-2xl group-hover:bg-gov-yellow-400/30 transition-all duration-500"></div>

                    {/* Card */}
                    <div className="relative transform hover:scale-105 transition-transform duration-500 ease-out">
                      <img
                        src="/cartao.png"
                        alt="Cartão Futuro Escolar - EducaBank"
                        className="w-full max-w-2xl h-auto drop-shadow-2xl"
                      />
                    </div>
                  </div>

                  {/* Cartão Futuro Escolar Logo */}
                  <div className="mt-8">
                    <img
                      src="/cartaofuturoescolar.png"
                      alt="Cartão Futuro Escolar"
                      className="h-20 w-auto drop-shadow-2xl"
                    />
                  </div>

                  {/* Floating Info Badge */}
                  <div className="mt-8 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/50 flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-700">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Limite Liberado</p>
                      <p className="text-2xl font-black text-gov-green-700">R$ 350,00 <span className="text-sm font-normal text-gray-600">/ filho</span></p>
                    </div>
                  </div>

                  {/* CTA Buttons - Moved Here */}
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full">
                    <PulsingButton href="/solicitar" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gov-blue-900 bg-gov-yellow-400 rounded-lg shadow-lg hover:bg-gov-yellow-500 transition-all transform hover:-translate-y-1 hover:shadow-2xl w-full sm:w-auto">
                      Solicitar Benefício
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </PulsingButton>
                    <a href="#sobre" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/20 transition-colors w-full sm:w-auto">
                      Saiba Mais
                      <ChevronDown className="ml-2 h-5 w-5" />
                    </a>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* PARTNER CAROUSEL */}
        <div className="bg-slate-50 border-b border-slate-200">
          <PartnerCarousel />
        </div>

        {/* ABOUT THE PROGRAM */}


        {/* PHOTO SECTION 1 - Família Feliz com Compras */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white border-t border-slate-200">
          <div className="container-centered">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              {/* Image */}
              <div className="mb-12 lg:mb-0 order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/familia2.png"
                    alt="Família feliz com material escolar"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <ScrollReveal animation="fade-up">
                  <div className="inline-flex items-center gap-2 bg-gov-blue-100 rounded-full px-4 py-2 mb-6">
                    <CheckCircle2 className="h-4 w-4 text-gov-blue-700" />
                    <span className="text-sm font-bold text-gov-blue-900 uppercase tracking-wide">Facilidade Total</span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
                    Compre tudo que seus filhos precisam
                  </h2>

                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    Com o <strong>Cartão Futuro Escolar</strong>, você tem acesso a milhares de papelarias e lojas credenciadas em todo o Brasil.
                    Cadernos, mochilas, uniformes, lápis de cor - tudo que a família precisa para começar o ano letivo com o pé direito.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Aceito em milhares de lojas</h4>
                        <p className="text-slate-600 text-sm">Papelarias, livrarias e lojas de departamento em todo o país</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Sem burocracia</h4>
                        <p className="text-slate-600 text-sm">Basta passar o cartão e pronto - aprovação instantânea</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* PHOTO SECTION 2 - Pagamento Aprovado */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="container-centered">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <ScrollReveal animation="fade-up">
                  <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-6">
                    <Shield className="h-4 w-4 text-green-700" />
                    <span className="text-sm font-bold text-green-900 uppercase tracking-wide">100% Seguro</span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
                    Pagamento rápido e aprovado na hora
                  </h2>

                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    O <strong>EducaBank</strong> utiliza tecnologia de ponta com chip e aproximação (contactless).
                    Suas compras são aprovadas instantaneamente, com total segurança e praticidade.
                  </p>

                  <div className="bg-gradient-to-br from-gov-blue-50 to-blue-50 border border-blue-100 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-white p-3 rounded-full shadow-sm">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-gov-blue-900">APROVADO</p>
                        <p className="text-sm text-slate-600">Transação confirmada em segundos</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      ✓ Chip EMV certificado<br />
                      ✓ Tecnologia contactless<br />
                      ✓ Bandeira VISA internacional
                    </p>
                  </div>
                </ScrollReveal>
              </div>

              {/* Image */}
              <div className="mt-12 lg:mt-0">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/pagando.png"
                    alt="Pagamento aprovado com EducaBank"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PHOTO SECTION 3 - Família com Cartão */}
        <section className="py-20 bg-gradient-to-br from-yellow-50 to-white border-t border-slate-200">
          <div className="container-centered">
            <div className="flex flex-col-reverse gap-12 lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              {/* Image */}
              <div className="lg:mb-0">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/familia1.png"
                    alt="Família beneficiada pelo EducaBank"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <ScrollReveal animation="fade-up">
                  <div className="inline-flex items-center gap-2 bg-gov-yellow-100 rounded-full px-4 py-2 mb-6">
                    <Users className="h-4 w-4 text-gov-yellow-700" />
                    <span className="text-sm font-bold text-gov-yellow-900 uppercase tracking-wide">23,4 Milhões Beneficiados</span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
                    Investindo no futuro das nossas crianças
                  </h2>

                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    O <strong>Programa EducaBank</strong> é mais que um cartão - é um investimento no futuro da educação brasileira.
                    Milhões de famílias já foram beneficiadas e garantiram o material escolar completo para seus filhos.
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <p className="text-3xl font-black text-gov-blue-900 mb-2">R$ 8,2bi</p>
                      <p className="text-sm text-slate-600">Investimento federal em 2026</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <p className="text-3xl font-black text-gov-green-700 mb-2">23,4M</p>
                      <p className="text-sm text-slate-600">Estudantes beneficiados</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <PulsingButton href="/solicitar" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gov-blue-800 rounded-lg shadow-lg hover:bg-gov-blue-900 transition-all transform hover:-translate-y-1">
                      Solicite Agora Seu Cartão
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </PulsingButton>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* DELIVERY SECTION - Correios Partnership */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200">
          <div className="container-centered">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              {/* Content */}
              <div className="mb-12 lg:mb-0">
                <ScrollReveal animation="fade-up">
                  <div className="inline-flex items-center gap-2 bg-yellow-100 rounded-full px-4 py-2 mb-6">
                    <Calendar className="h-4 w-4 text-yellow-700" />
                    <span className="text-sm font-bold text-yellow-900 uppercase tracking-wide">Entrega Rápida</span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
                    Receba seu cartão em casa com segurança
                  </h2>

                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Em parceria com os <strong>Correios</strong>, garantimos a entrega do seu <strong>Cartão Futuro Escolar</strong>
                    com total segurança e rastreamento em tempo real. Após a aprovação, você receberá o cartão físico
                    diretamente no endereço cadastrado.
                  </p>

                  {/* Correios Logo */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src="/correios.png"
                        alt="Correios"
                        className="h-12 w-auto"
                      />
                      <div className="h-12 w-px bg-slate-300"></div>
                      <div>
                        <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Parceiro Oficial</p>
                        <p className="text-lg font-bold text-slate-900">Entrega Garantida</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      Empresa Brasileira de Correios e Telégrafos - ECT
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Prazo de entrega: até 10 dias úteis</h4>
                        <p className="text-slate-600 text-sm">Após o pagamento da taxa de emissão</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Rastreamento online</h4>
                        <p className="text-slate-600 text-sm">Acompanhe seu cartão em tempo real pelo código de rastreio</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Entrega segura e certificada</h4>
                        <p className="text-slate-600 text-sm">Envelope lacrado com identificação EducaBank</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-gov-blue-50 border border-gov-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gov-blue-900">
                      <strong>💡 Dica:</strong> Enquanto aguarda o cartão físico, você já pode usar o <strong>cartão virtual</strong>
                      disponível imediatamente após a aprovação!
                    </p>
                  </div>
                </ScrollReveal>
              </div>

              {/* Image */}
              <div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/envio.png"
                    alt="Entrega do Cartão Futuro Escolar via Correios"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="container-centered">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Benefícios do Programa</h2>
              <p className="text-slate-600">Simples, rápido e direto para quem precisa. O cartão é aceito em milhares de papelarias credenciadas.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <ScrollReveal delay={0.1}>
                <FeatureCard
                  icon={<Users className="h-8 w-8 text-blue-600" />}
                  title="Para quem é?"
                  description="Famílias com filhos matriculados na rede pública de ensino fundamental e médio, inscritas no CadÚnico."
                />
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <FeatureCard
                  icon={<ShoppingBag className="h-8 w-8 text-green-600" />}
                  title="Onde usar?"
                  description="Exclusivo para compra de material escolar: cadernos, mochilas, uniformes, livros e itens de papelaria."
                />
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <FeatureCard
                  icon={<School className="h-8 w-8 text-yellow-600" />}
                  title="Renovação Anual"
                  description="O saldo é renovado automaticamente todo início de ano letivo, sem necessidade de nova solicitação."
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ABOUT THE PROGRAM */}
        <section id="sobre" className="py-20 bg-white border-t border-slate-200">
          <div className="container-centered">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal animation="fade-up">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Sobre o Programa EducaBank</h2>
                  <p className="text-slate-600 text-lg">Entenda a origem e o funcionamento deste benefício</p>
                </div>
              </ScrollReveal>

              <div className="prose prose-lg max-w-none">
                <ScrollReveal animation="fade-up" delay={0.1}>
                  <div className="bg-blue-50 border-l-4 border-gov-blue-700 p-6 rounded-r-lg mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-gov-blue-900" />
                      <h3 className="text-xl font-bold text-gov-blue-900 m-0">Base Legal</h3>
                    </div>
                    <p className="text-slate-700 mb-2">
                      O <strong>Programa EducaBank - Cartão Futuro Escolar</strong> foi instituído pela <strong>Lei Federal nº 14.892/2025</strong>,
                      sancionada em 18 de dezembro de 2025 e publicada no Diário Oficial da União em 19 de dezembro de 2025.
                    </p>
                    <p className="text-slate-700 mb-0">
                      A regulamentação foi estabelecida pelo <strong>Decreto nº 12.456/2025</strong>, que definiu os critérios
                      de elegibilidade, valores e prazos de vigência do benefício.
                    </p>
                  </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <ScrollReveal animation="fade-up" delay={0.2}>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="h-6 w-6 text-gov-blue-700" />
                        <h4 className="font-bold text-slate-900 text-lg m-0">Vigência</h4>
                      </div>
                      <p className="text-slate-600 mb-0">
                        O programa entrou em vigor em <strong>1º de janeiro de 2026</strong> e tem validade até 31 de dezembro de 2030,
                        com renovação automática anual do saldo.
                      </p>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal animation="fade-up" delay={0.3}>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="h-6 w-6 text-gov-green-600" />
                        <h4 className="font-bold text-slate-900 text-lg m-0">Orçamento</h4>
                      </div>
                      <p className="text-slate-600 mb-0">
                        Investimento federal de <strong>R$ 8,2 bilhões</strong> em 2026, beneficiando aproximadamente
                        23,4 milhões de estudantes em todo o país.
                      </p>
                    </div>
                  </ScrollReveal>
                </div>

                <ScrollReveal animation="fade-up" delay={0.4}>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Como Funciona?</h3>
                  <ol className="space-y-4 text-slate-700">
                    <li className="flex gap-3">
                      <span className="font-bold text-gov-blue-700 flex-shrink-0">1.</span>
                      <span><strong>Elegibilidade:</strong> Famílias inscritas no Cadastro Único (CadÚnico) com renda per capita de até meio salário mínimo e filhos matriculados na rede pública de ensino.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-gov-blue-700 flex-shrink-0">2.</span>
                      <span><strong>Solicitação:</strong> O responsável familiar acessa o portal, preenche os dados e envia a documentação comprobatória (RG, CPF, certidões de nascimento dos dependentes).</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-gov-blue-700 flex-shrink-0">3.</span>
                      <span><strong>Análise:</strong> O sistema cruza os dados com as bases do MEC, INEP e CadÚnico para validação automática em até 48 horas.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-gov-blue-700 flex-shrink-0">4.</span>
                      <span><strong>Aprovação:</strong> Após aprovação, o cartão virtual é gerado instantaneamente e o cartão físico pode ser solicitado mediante taxa de emissão.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-gov-blue-700 flex-shrink-0">5.</span>
                      <span><strong>Uso:</strong> O benefício pode ser utilizado exclusivamente em estabelecimentos credenciados para compra de material escolar, uniformes e livros didáticos.</span>
                    </li>
                  </ol>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION - SOCIAL PROOF */}
        <TestimonialsSection />

        {/* FAQ */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="container-centered max-w-3xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Perguntas Frequentes</h2>

            <div className="space-y-4">
              <ScrollReveal animation="fade-up" delay={0.1}>
                <div className="space-y-4">
                  <FAQItem
                    question="Preciso estar no CadÚnico para solicitar?"
                    answer="Sim. O programa é destinado exclusivamente a famílias já cadastradas no Cadastro Único com renda per capita de até meio salário mínimo."
                  />
                  <FAQItem
                    question="Posso usar o cartão para qualquer compra?"
                    answer="Não. O cartão é bloqueado para uso exclusivo em estabelecimentos credenciados e apenas para itens de material escolar, uniformes e livros didáticos."
                  />
                  <FAQItem
                    question="O que acontece se eu não usar todo o saldo?"
                    answer="O saldo não utilizado expira em 31 de dezembro do ano corrente e não é acumulativo. Um novo saldo é liberado no início do próximo ano letivo."
                  />
                  <FAQItem
                    question="Quanto tempo leva para receber o cartão físico?"
                    answer="Após o pagamento da taxa de emissão, o cartão é enviado pelos Correios e chega em até 10 dias úteis no endereço cadastrado."
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <GovFooter />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <details className="bg-slate-50 rounded-lg border border-slate-200 p-6 group">
      <summary className="font-bold text-slate-900 cursor-pointer list-none flex justify-between items-center">
        {question}
        <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
      </summary>
      <p className="mt-4 text-slate-600 leading-relaxed">{answer}</p>
    </details>
  );
}
