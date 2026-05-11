import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { searchClient, INDEX_NAME } from '@/lib/algolia';
import { DesenhoCard } from '@/components/DesenhoCard';
import { OfertaCard } from '@/components/OfertaCard';
import { capitalize } from '@/lib/utils';
import type { AlgoliaDesenhoRecord } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const nome = capitalize(slug.replace(/-/g, ' '));
  return {
    title: `Desenhos do ${nome} para colorir`,
    description: `Todos os desenhos do ${nome} para colorir e imprimir grátis. Variedade de poses, cenários e idades.`,
    alternates: { canonical: `/personagem/${slug}` },
  };
}

async function fetchByPersonagem(slug: string) {
  try {
    const { results } = await searchClient.search({
      requests: [
        {
          indexName: INDEX_NAME,
          query: '',
          filters: `subject_slug:${slug}`,
          hitsPerPage: 100,
        },
      ],
    });
    const first = results[0] as { hits?: unknown[] };
    return (first?.hits || []) as Partial<AlgoliaDesenhoRecord>[];
  } catch {
    return [];
  }
}

export default async function PersonagemPage({ params }: PageProps) {
  const { slug } = await params;
  const desenhos = await fetchByPersonagem(slug);

  if (!desenhos.length) notFound();

  const nome = capitalize(slug.replace(/-/g, ' '));

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-ink/60 mb-4">
        <Link href="/" className="hover:text-coral">Início</Link> / <span className="text-ink/40">{nome}</span>
      </nav>

      <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
        Desenhos do <span className="text-coral">{nome}</span> para colorir
      </h1>
      <p className="text-ink/70 mb-8">
        {desenhos.length} desenhos disponíveis. Baixe e imprima grátis.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {desenhos.map((d, i) => (
              <DesenhoCard key={d.objectID as string} desenho={d} priority={i < 4} />
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <OfertaCard variant="sidebar" />
        </div>
      </div>

      <div className="mt-12">
        <OfertaCard variant="compact" />
      </div>

      <div className="h-20 lg:hidden" />
      <OfertaCard variant="sticky-mobile" />
    </div>
  );
}
