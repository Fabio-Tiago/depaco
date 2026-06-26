import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { searchClient, INDEX_NAME } from '@/lib/algolia';
import { DesenhoCard } from '@/components/DesenhoCard';
import { OfertaCard } from '@/components/OfertaCard';
import { capitalize, formatarNome } from '@/lib/utils';
import type { AlgoliaDesenhoRecord } from '@/types';

interface PageProps {
  params: Promise<{ categoria: string }>;
}

export const revalidate = 3600;

const CATEGORIA_NAMES: Record<string, string> = {
  personagem_filme: 'Personagens de Filme',
  personagem_anime: 'Anime e Mangá',
  animal: 'Animais',
  tema_sazonal: 'Datas Comemorativas',
  humano: 'Profissões',
  educacional: 'Educacional',
  objeto: 'Objetos',
  natureza: 'Natureza',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria } = await params;
  const nome = CATEGORIA_NAMES[categoria] || capitalize(categoria.replace(/_/g, ' '));
  return {
    title: `${nome} — Desenhos para colorir`,
    description: `Desenhos de ${nome.toLowerCase()} para colorir e imprimir grátis.`,
    alternates: { canonical: `/categorias/${categoria}` },
  };
}

async function fetchByCategoria(categoria: string) {
  try {
    const { results } = await searchClient.search({
      requests: [
        {
          indexName: INDEX_NAME,
          query: '',
          filters: `categorias:"${categoria}"`,
          hitsPerPage: 100,
          facets: ['subject_slug'],
        },
      ],
    });
    const first = results[0] as { hits?: unknown[]; facets?: Record<string, Record<string, number>> };
    return {
      hits: (first?.hits || []) as Partial<AlgoliaDesenhoRecord>[],
      personagens: first?.facets?.subject_slug || {},
    };
  } catch {
    return { hits: [], personagens: {} };
  }
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria } = await params;
  const { hits, personagens } = await fetchByCategoria(categoria);

  if (!hits.length) notFound();

  const nome = CATEGORIA_NAMES[categoria] || capitalize(categoria.replace(/_/g, ' '));
  const personagensArr = Object.entries(personagens).slice(0, 12);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-ink/60 mb-4">
        <Link href="/" className="hover:text-coral">Início</Link> / <span className="text-ink/40">{nome}</span>
      </nav>

      <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
        {nome} para colorir
      </h1>
      <p className="text-ink/70 mb-8">
        {hits.length} desenhos disponíveis nesta categoria.
      </p>

      {/* Personagens dessa categoria */}
      {personagensArr.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl font-bold text-ink mb-4">Personagens populares</h2>
          <div className="flex flex-wrap gap-2">
            {personagensArr.map(([slug, count]) => (
              <Link
                key={slug}
                href={`/personagem/${slug}`}
                className="px-4 py-2 bg-white border-2 border-ink/10 rounded-full font-bold text-sm hover:border-ink hover:bg-mustard-50 transition-all"
              >
                {formatarNome(slug)}{' '}
                <span className="text-ink/40 font-normal">({count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <OfertaCard variant="compact" />

      <h2 className="font-display text-2xl font-bold text-ink mt-12 mb-6">
        Todos os desenhos
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {hits.map((d, i) => (
          <DesenhoCard key={d.objectID as string} desenho={d} priority={i < 5} />
        ))}
      </div>

      <div className="h-20 lg:hidden" />
      <OfertaCard variant="sticky-mobile" />
    </div>
  );
}
