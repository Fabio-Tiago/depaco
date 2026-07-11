import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Zap, Sparkles, Star, Gift, Clock, MessageCircle, Lock } from 'lucide-react';
import { getPackById, PACKS, formatBRL, calcDesconto } from '@/lib/oferta';
import { BotaoCheckout } from '@/components/BotaoCheckout';
import { GaleriaPackAnimada } from '@/components/GaleriaPackAnimada';
import { CheckoutElements } from '@/components/CheckoutElements';
import { fetchDesenhosGaleria } from '@/lib/algolia';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 86400;

/** Gera uma página estática para cada pack do catálogo. */
export async function generateStaticParams() {
  return PACKS.map((pack) => ({ id: pack.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pack = getPackById(id);
  if (!pack) return { title: 'Pack não encontrado' };

  return {
    title: `${pack.nome} — ${pack.total_desenhos} desenhos para colorir`,
    description: `Receba ${pack.total_desenhos} desenhos exclusivos em PDF. Pronto para imprimir.`,
    alternates: { canonical: `/pack/${pack.id}` },
  };
}

export default async function PackPage({ params }: PageProps) {
  const { id } = await params;
  const pack = getPackById(id);

  if (!pack) notFound();

  const desconto = pack.preco_de ? calcDesconto(pack.preco_de, pack.preco) : 0;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://depaco.com.br';

  // Imagem do produto para o Schema (exigida pelo Google nas
  // listagens de comércio). Usa as previews do pack se houver;
  // senão, cai para uma imagem padrão definida em env var.
  // Precisa ser URL absoluta (https://...).
  const imagemProduto =
    pack.preview_urls && pack.preview_urls.length > 0
      ? pack.preview_urls
      : [process.env.NEXT_PUBLIC_OG_IMAGE_FALLBACK || `${siteUrl}/og-pack.png`];
  
  // Desenhos variados (1 de cada categoria, intercalados) para a galeria
  const desenhosGaleria = await fetchDesenhosGaleria(6);
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pack.nome,
    description: pack.descricao,
    image: imagemProduto,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: pack.preco,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/pack/${pack.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-10">
        {/* HERO da oferta */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-terracotta text-cream rounded-full text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" /> OFERTA LIMITADA
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-[1.05] mb-4">
              {pack.total_desenhos}+ desenhos prontos pra{' '}
              <span className="text-terracotta">imprimir e colorir</span>
            </h1>

            <p className="text-xl text-ink/70 mb-8">
              Receba imediatamente um PDF com {pack.total_desenhos} desenhos únicos.
              Variedade de personagens, animais, profissões e datas comemorativas.
            </p>

            <div className="bg-white border-2 border-ink rounded-3xl p-6 shadow-chunky-lg mb-6">
              <div className="flex items-baseline justify-between mb-1">
                {pack.preco_de && (
                  <span className="text-ink/50">
                    De <span className="line-through">{formatBRL(pack.preco_de)}</span>
                  </span>
                )}
                {desconto > 0 && (
                  <span className="px-2 py-0.5 bg-mustard text-ink rounded-md text-xs font-bold border-2 border-ink">
                    -{desconto}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-bold text-ink">Por</span>
                <span className="text-5xl md:text-6xl font-display font-bold text-terracotta">
                  {formatBRL(pack.preco)}
                </span>
                <span className="text-sm text-ink/60">à vista</span>
              </div>
              <p className="text-sm text-ink/60">ou em até 3x sem juros no cartão</p>
            </div>

            <BotaoCheckout
              pack={pack}
              className="block w-full px-8 py-5 bg-terracotta text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky-lg hover:translate-y-[-3px] transition-all text-center text-xl"
            >
              QUERO MEU PACK AGORA →
            </BotaoCheckout>

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-ink/70">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-coral" /> 7 dias de garantia
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-coral" /> Acesso imediato
              </span>
            </div>
          </div>

          {/* Preview mockup do PDF — galeria animada com desenhos reais */}
          <GaleriaPackAnimada
            desenhos={desenhosGaleria}
            restante={pack.total_desenhos - 4}
          />
        </div>

        {/* O que está incluso */}
        <section className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink text-center mb-10">
            O que você vai receber
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Gift,
                title: `${pack.total_desenhos} desenhos exclusivos`,
                desc: 'Cuidadosamente selecionados e organizados por categoria',
              },
              {
                icon: Clock,
                title: 'Entrega imediata',
                desc: 'Receba o link de download no email logo após o pagamento',
              },
              {
                icon: Star,
                title: 'Qualidade premium',
                desc: 'Linhas nítidas, prontas para imprimir em A4 sem perda de qualidade',
              },
              {
                icon: ShieldCheck,
                title: '7 dias de garantia',
                desc: 'Não gostou? Devolvemos 100% do seu dinheiro, sem perguntas',
              },
              {
                icon: MessageCircle,
                title: 'Suporte por WhatsApp',
                desc: 'Tire suas dúvidas direto com a gente, sem robô',
              },
              {
                icon: Sparkles,
                title: 'Bônus surpresa',
                desc: '+15 desenhos especiais de datas comemorativas inclusos',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border-2 border-ink rounded-2xl p-6 shadow-chunky-sm"
              >
                <div className="w-12 h-12 bg-mustard-100 border-2 border-ink rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-terracotta" />
                </div>
                <h3 className="font-display font-bold text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink/70">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CHECKOUT EMBUTIDO (Eduzz Checkout Elements) */}
        {pack.checkoutContentId && (
          <section id="checkout" className="mb-16 scroll-mt-24">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-mustard-100 border-2 border-ink rounded-full text-sm font-bold mb-4 shadow-chunky-sm">
                <Lock className="w-4 h-4" />
                <span>Pagamento seguro</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
                Finalize sua compra
              </h2>
              <p className="text-ink/60 mt-2">
                Acesso imediato após a confirmação do pagamento
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white border-2 border-ink rounded-3xl shadow-chunky p-4 md:p-6">
                <CheckoutElements contentId={pack.checkoutContentId} />
              </div>

              <p className="text-center text-sm text-ink/50 mt-4">
                Processado pela Eduzz · Cartão, Pix ou boleto
              </p>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink text-center mb-10">
            Perguntas frequentes
          </h2>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: 'Como recebo os desenhos depois da compra?',
                a: 'Logo após a confirmação do pagamento, você recebe um email com o link para baixar o PDF completo. Também fica disponível na sua conta da plataforma de pagamento.',
              },
              {
                q: 'Posso imprimir quantas vezes quiser?',
                a: 'Sim! Você pode imprimir os desenhos quantas vezes quiser, para uso pessoal, da família, da escola ou em festas infantis.',
              },
              {
                q: 'Funciona em qualquer impressora?',
                a: 'Sim. Os desenhos foram formatados em A4 padrão e funcionam em qualquer impressora doméstica ou profissional. Recomendamos papel sulfite branco comum.',
              },
              {
                q: 'Pra que idades os desenhos são indicados?',
                a: 'O pack tem variedade pensada de 2 a 12 anos. Os desenhos são marcados por faixa etária no PDF, com desenhos mais simples para os pequenos e mais detalhados para os maiores.',
              },
              {
                q: 'E se eu não gostar?',
                a: 'Oferecemos garantia incondicional de 7 dias. Se não gostar por qualquer motivo, devolvemos 100% do valor pago, sem perguntas.',
              },
              {
                q: 'Posso pagar via Pix ou boleto?',
                a: 'Sim! Aceitamos cartão de crédito (até 3x sem juros), Pix e boleto bancário através da nossa plataforma de pagamentos.',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="bg-white border-2 border-ink rounded-2xl p-5 shadow-chunky-sm group"
              >
                <summary className="font-display font-bold text-ink cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-coral text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-ink/70">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-gradient-to-br from-mustard-100 to-coral-100 border-2 border-ink rounded-3xl p-8 md:p-12 text-center shadow-chunky-lg">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-ink mb-4">
            Pronto pra começar a diversão?
          </h2>
          <p className="text-lg text-ink/70 mb-8 max-w-xl mx-auto">
            {pack.total_desenhos} desenhos por {formatBRL(pack.preco)}. Acesso imediato. 7 dias de garantia.
          </p>
          <BotaoCheckout
            pack={pack}
            className="inline-block px-10 py-5 bg-terracotta text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky-lg hover:translate-y-[-3px] transition-all text-xl"
          >
            QUERO MEU PACK AGORA →
          </BotaoCheckout>
        </section>
      </div>
    </>
  );
}
