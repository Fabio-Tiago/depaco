import { algoliasearch } from 'algoliasearch';

/**
 * Cliente Algolia compartilhado entre Server e Client Components.
 * Usa SEARCH_KEY (chave search-only, segura de expor no client).
 */
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
);

export const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'depaco';

/**
 * Busca server-side por objectID. Usada em getStaticPaths/getStaticProps
 * para gerar páginas individuais de desenho.
 */
export async function fetchDesenhoById(objectID: string) {
  try {
    const result = await searchClient.getObject({
      indexName: INDEX_NAME,
      objectID,
    });
    return result as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Busca desenhos relacionados ao mesmo personagem.
 */
export async function fetchDesenhosRelacionados(
  subjectSlug: string,
  exceptId: string,
  limit = 8
) {
  try {
    const { results } = await searchClient.search({
      requests: [
        {
          indexName: INDEX_NAME,
          query: '',
          filters: `subject_slug:"${subjectSlug}" AND NOT objectID:"${exceptId}"`,
          hitsPerPage: limit,
        },
      ],
    });
    type ResultLike = { hits?: unknown[] };
    const first = results[0] as ResultLike;
    return (first?.hits || []) as Record<string, unknown>[];
  } catch {
    return [];
  }
}

/**
 * Lista todos os desenhos paginados (usado para gerar generateStaticParams).
 */
export async function fetchAllDesenhoIds(): Promise<string[]> {
  const ids: string[] = [];
  let cursor: string | undefined = undefined;

  try {
    do {
      const result: { hits: Array<{ objectID: string }>; cursor?: string } =
        await searchClient.browse({
          indexName: INDEX_NAME,
          browseParams: { cursor, hitsPerPage: 1000 },
        });

      for (const hit of result.hits) ids.push(hit.objectID);
      cursor = result.cursor;
    } while (cursor);
  } catch (e) {
    console.warn('Erro ao listar desenhos no Algolia:', e);
  }

  return ids;
}

/**
 * Lista personagens únicos (para gerar páginas /personagem/[slug]).
 */
export async function fetchPersonagensUnicos(): Promise<
  Array<{ slug: string; nome: string; total: number }>
> {
  try {
    const { results } = await searchClient.search({
      requests: [
        {
          indexName: INDEX_NAME,
          query: '',
          facets: ['subject_slug', 'personagem'],
          hitsPerPage: 0,
          maxValuesPerFacet: 500,
        },
      ],
    });

    type FacetResult = { facets?: Record<string, Record<string, number>> };
    const first = results[0] as FacetResult;
    const facets = first?.facets?.subject_slug || {};

    return Object.entries(facets).map(([slug, total]) => ({
      slug,
      nome: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      total: total as number,
    }));
  } catch (e) {
    console.warn('Erro ao listar personagens:', e);
    return [];
  }
}

/**
 * Busca desenhos de um personagem para o carrossel do blog.
 * Server-side, poucos campos, otimizado para não pesar.
 */
export async function fetchDesenhosCarrossel(subjectSlug: string, limit = 10) {
  if (!subjectSlug) return [];
  try {
    const { results } = await searchClient.search({
      requests: [
        {
          indexName: INDEX_NAME,
          query: '',
          filters: `subject_slug:"${subjectSlug}"`,
          hitsPerPage: limit,
          attributesToRetrieve: ['objectID', 'personagem', 'pose', 'url_imagem'],
        },
      ],
    });
    const first = results[0] as { hits?: unknown[] };
    return (first?.hits || []) as Array<{
      objectID: string;
      personagem: string;
      pose: string;
      url_imagem: string;
    }>;
  } catch {
    return [];
  }
}

/**
 * Resolve a imagem de capa (og:image) de um post do blog.
 * Ordem de prioridade:
 *   1. cover explícito no frontmatter (se algum dia for definido)
 *   2. um desenho do acervo, buscado pelo related_personagem (Algolia)
 *   3. fallback padrão da marca (env NEXT_PUBLIC_OG_IMAGE_FALLBACK)
 * Retorna string vazia se nada for encontrado (template trata).
 */
export async function resolverCapaPost(opts: {
  cover?: string;
  related_personagem?: string;
}): Promise<string> {
  if (opts.cover) return opts.cover;

  if (opts.related_personagem) {
    try {
      const desenhos = await fetchDesenhosCarrossel(opts.related_personagem, 1);
      if (desenhos.length && desenhos[0]?.url_imagem) {
        return desenhos[0].url_imagem;
      }
    } catch {
      // segue para o fallback
    }
  }

  return process.env.NEXT_PUBLIC_OG_IMAGE_FALLBACK || '';
}
