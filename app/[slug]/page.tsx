import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Printer, Sparkles } from 'lucide-react';
import { DesenhoCard } from '@/components/DesenhoCard';
import { OfertaCard } from '@/components/OfertaCard';
import { BotaoCheckout } from '@/components/BotaoCheckout';
import {
  fetchDesenhosPorFiltro,
  fetchDesenhosFofosPorBichinho,
} from '@/lib/algolia';
import { PAGINAS_FOFAS, getPaginaFofa } from '@/lib/paginasFofas';
import { getPackById, PACKS, formatBRL } from '@/lib/oferta';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Revalida de hora em hora: conteúdo estável, ótimo para SEO.
export const revalidate = 3600;

// Gera todas as páginas estaticamente no build (rápidas + indexáveis).
export function generateStaticParams() {
  return PAGINAS_FOFAS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pagina = getPaginaFofa(slug);
  if (!pagina) return {};

  return {
    title: pagina.title,
    description: pagina.description,
    alternates: { canonical: `/${pagina.slug}` },
    openGraph: {
      title: pagina.title,
      description: pagina.description,
      type: 'website',
    },
  };
}

export default async function PaginaFofaRoute({ params }: PageProps) {
  const { slug } = await params;
  const pagina = getPaginaFofa(slug);
  if (!pagina) notFound();

  // Busca os desenhos conforme o tipo de página
  const desenhos =
    pagina.busca.tipo === 'bichinho'
      ? await fetchDesenhosFofosPorBichinho(pagina.busca.valor, 48)
      : await fetchDesenhosPorFiltro(pagina.busca.valor, 48);

  // Pack em destaque (usado no CTA)
  const pack = PACKS.find((p) => p.isDefault) || PACKS[0];

  // Outras páginas do nicho, para linkagem interna (bom para SEO)
  const outras = PAGINAS_FOFAS.filter((p) => p.slug !== pagina.slug);

  // Schema.org: ajuda o Google a entender que é uma coleção de imagens
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pagina.h1,
    description: pagina.description,
    url: `https://depaco.com.br/${pagina.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-10">
        {/* HERO */}
        <header className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-mustard-100 border-2 border-ink rounded-full text-sm font-bold mb-4 shadow-chunky-sm">
            <span>{pagina.emoji}</span>
            <span>{desenhos.length > 0 ? `${desenhos.length}+ desenhos` : 'Grátis'}</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-[1.05] mb-3">
            {pagina.h1}
          </h1>
          <p className="text-xl text-ink/70">{pagina.subtitulo}</p>
        </header>

        {/* CTA do pack em destaque (páginas com intenção de imprimir) */}
        {pagina.focoNoPack && pack && (
          <section className="mb-10">
            <div className="bg-white border-2 border-ink rounded-3xl p-6 shadow-chunky flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 text-terracotta font-bold text-sm mb-1">
                  <Sparkles className="w-4 h-4" /> PACK COMPLETO
                </div>
                <p className="font-display text-2xl font-bold text-ink">
                  Quer todos de uma vez?
                </p>
                <p className="text-ink/70">
                  {pack.total_desenhos}+ desenhos organizados por idade e tema, em PDF.
                </p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-terracotta mb-2">
                  {formatBRL(pack.preco)}
                </p>
                <BotaoCheckout
                  pack={pack}
                  className="inline-block px-6 py-3 bg-terracotta text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky hover:translate-y-[-2px] transition-all"
                >
                  QUERO O PACK →
                </BotaoCheckout>
              </div>
            </div>
          </section>
        )}

        {/* GRID DE DESENHOS */}
        {desenhos.length > 0 ? (
          <section className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {desenhos.map((d) => (
                <DesenhoCard key={d.objectID} desenho={d} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-12 text-center py-12 bg-cream border-2 border-ink rounded-3xl">
            <p className="text-ink/70">
              Estamos preparando novos desenhos para esta página. Enquanto isso,{' '}
              <Link href="/buscar" className="text-coral font-bold hover:underline">
                veja todo o acervo
              </Link>
              .
            </p>
          </section>
        )}

        {/* TEXTO SEO (abaixo do conteúdo, como o Google gosta) */}
        <section className="mb-12 max-w-3xl">
          <div className="bg-cream border-2 border-ink rounded-3xl p-6 md:p-8 shadow-chunky-sm">
            <h2 className="font-display text-2xl font-bold text-ink mb-3">
              Sobre estes desenhos
            </h2>
            <p className="text-ink/80 leading-relaxed mb-4">{pagina.texto}</p>

            <h3 className="font-display text-lg font-bold text-ink mb-2 flex items-center gap-2">
              <Printer className="w-5 h-5 text-coral" /> Como imprimir
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-ink/80">
              <li>Clique no desenho que a criança escolher</li>
              <li>Baixe o arquivo (é grátis, sem cadastro)</li>
              <li>Imprima em folha A4 comum</li>
              <li>Separe lápis de cor, giz de cera ou canetinha</li>
            </ol>
          </div>
        </section>

        {/* LINKAGEM INTERNA — reforça o cluster de SEO */}
        {outras.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-ink mb-4">
              Veja também
            </h2>
            <div className="flex flex-wrap gap-3">
              {outras.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-ink rounded-full font-bold text-sm shadow-chunky-sm hover:-translate-y-0.5 hover:shadow-chunky transition-all"
                >
                  <span>{p.emoji}</span>
                  {p.h1}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Oferta padrão no rodapé (páginas sem foco no pack) */}
        {!pagina.focoNoPack && (
          <section className="mb-8">
            <OfertaCard variant="compact" />
          </section>
        )}

        <div className="h-20 lg:hidden" />
        <OfertaCard variant="sticky-mobile" />
      </div>
    </>
  );
}
