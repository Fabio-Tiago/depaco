import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { fetchDesenhoById, fetchDesenhosRelacionados } from '@/lib/algolia';
import { DesenhoActions } from '@/components/DesenhoActions';
import { DesenhoCard } from '@/components/DesenhoCard';
import { OfertaCard } from '@/components/OfertaCard';
import { capitalize } from '@/lib/utils';
import type { AlgoliaDesenhoRecord } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

// ISR — regenera a cada 24h
export const revalidate = 86400;

/**
 * Gera metadata dinâmica por desenho — crítico pra SEO.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const desenho = (await fetchDesenhoById(id)) as Partial<AlgoliaDesenhoRecord> | null;

  if (!desenho) return { title: 'Desenho não encontrado' };

  const personagem = capitalize(desenho.personagem || 'Desenho');
  const idade = desenho.idade_alvo_raw?.replace(/_/g, ' ') || '';
  const title = `${personagem} ${desenho.pose ? `— ${desenho.pose}` : ''} para colorir`;
  const description = `Desenho do ${personagem} para colorir e imprimir grátis. ${desenho.pose ? `${capitalize(desenho.pose)}.` : ''} ${idade ? `Indicado para crianças de ${idade}.` : ''} Baixe agora em PDF/PNG.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: desenho.url_imagem ? [{ url: desenho.url_imagem, width: 1024, height: 1024 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: desenho.url_imagem ? [desenho.url_imagem] : [],
    },
    alternates: {
      canonical: `/desenhos/${id}`,
    },
  };
}

export default async function DesenhoPage({ params }: PageProps) {
  const { id } = await params;
  const desenho = (await fetchDesenhoById(id)) as Partial<AlgoliaDesenhoRecord> | null;

  if (!desenho) notFound();

  const relacionados = (await fetchDesenhosRelacionados(
    desenho.subject_slug || '',
    desenho.objectID || '',
    8
  )) as Partial<AlgoliaDesenhoRecord>[];

  const personagem = capitalize(desenho.personagem || 'Desenho');
  const filename = `${desenho.subject_slug}-${desenho.objectID}.png`;

  // Schema.org structured data — ESSENCIAL PRO SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: desenho.url_imagem,
    name: `${personagem} para colorir`,
    description: `Desenho do ${personagem} para colorir e imprimir`,
    creditText: 'DEPACO',
    creator: {
      '@type': 'Organization',
      name: 'DEPACO',
    },
    copyrightNotice: '© DEPACO',
    license: `${process.env.NEXT_PUBLIC_SITE_URL}/termos`,
    acquireLicensePage: `${process.env.NEXT_PUBLIC_SITE_URL}/desenhos/${id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-ink/60 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-coral inline-flex items-center gap-1">
            <HomeIcon className="w-3.5 h-3.5" /> Início
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/personagem/${desenho.subject_slug}`} className="hover:text-coral">
            {personagem}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink/40 truncate">{desenho.pose}</span>
        </nav>

        {/* Layout principal: desenho + oferta */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 mb-12">
          {/* Coluna esquerda: desenho + ações */}
          <div>
            {/* Título */}
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-2">
              {personagem}{' '}
              <span className="text-coral">para colorir</span>
            </h1>
            {desenho.pose && (
              <p className="text-lg text-ink/60 mb-6">{capitalize(desenho.pose)}</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {desenho.idade_alvo_raw && (
                <span className="px-3 py-1 bg-mustard-100 border-2 border-ink/20 rounded-full text-xs font-bold">
                  {desenho.idade_alvo_raw.replace(/_/g, ' ')}
                </span>
              )}
              {desenho.pose_tipo && (
                <span className="px-3 py-1 bg-coral-100 border-2 border-ink/20 rounded-full text-xs font-bold">
                  {desenho.pose_tipo}
                </span>
              )}
              {desenho.cenario && (
                <span className="px-3 py-1 bg-sky-100 border-2 border-ink/20 rounded-full text-xs font-bold">
                  {desenho.cenario}
                </span>
              )}
            </div>

            {/* IMAGEM GRANDE */}
            <div className="relative aspect-square w-full max-w-2xl mx-auto bg-white border-2 border-ink rounded-3xl overflow-hidden shadow-chunky-lg mb-6">
              {desenho.url_imagem && (
                <Image
                  src={desenho.url_imagem}
                  alt={`${personagem} ${desenho.pose || ''} para colorir`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  className="object-contain p-4"
                />
              )}
            </div>

            {/* Ações de download/impressão */}
            <DesenhoActions imageUrl={desenho.url_imagem || ''} filename={filename} />

            {/* Texto SEO — descrição do desenho */}
            <div className="mt-10 prose prose-ink max-w-none">
              <h2 className="font-display text-2xl font-bold text-ink mb-3">
                Sobre este desenho do {personagem}
              </h2>
              <p className="text-ink/80 leading-relaxed">
                Este desenho do {personagem} para colorir é perfeito para crianças
                {desenho.idade_alvo_raw && ` de ${desenho.idade_alvo_raw.replace(/_/g, ' ')}`}.
                {desenho.cenario && ` A cena mostra ${desenho.cenario.toLowerCase()}.`}{' '}
                Imprima em folha A4 e deixe a criança soltar a criatividade com lápis de cor,
                giz de cera ou tinta guache.
              </p>
              <h3 className="font-display text-xl font-bold text-ink mt-6 mb-2">
                Como usar este desenho
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-ink/80">
                <li>Clique em &quot;Baixar PNG&quot; para salvar no seu computador ou celular</li>
                <li>Imprima em folha A4 comum</li>
                <li>Entregue para a criança junto com lápis de cor ou giz</li>
                <li>Tire foto do resultado e compartilhe com a gente!</li>
              </ol>
            </div>
          </div>

          {/* Coluna direita: oferta sticky */}
          <div className="hidden lg:block">
            <OfertaCard variant="sidebar" />
          </div>
        </div>

        {/* Desenhos relacionados */}
        {relacionados.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-6">
              Mais desenhos do {personagem}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {relacionados.map((r) => (
                <DesenhoCard key={r.objectID as string} desenho={r} />
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href={`/personagem/${desenho.subject_slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-mustard text-ink rounded-2xl font-bold border-2 border-ink shadow-chunky-sm hover:shadow-chunky hover:-translate-y-1 transition-all"
              >
                Ver todos do {personagem} →
              </Link>
            </div>
          </section>
        )}

        {/* Oferta compacta no fim (catch quem chegou até aqui) */}
        <section className="mb-12">
          <OfertaCard variant="compact" />
        </section>
      </div>

      {/* Sticky mobile no rodapé */}
      <div className="h-20 lg:hidden" />
      <OfertaCard variant="sticky-mobile" />
    </>
  );
}
