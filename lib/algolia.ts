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

/**
 * Busca os valores de categoria que realmente existem no índice (via facet).
 * Retorna lista de slugs ordenada por quantidade (mais desenhos primeiro).
 * Requer que `categorias` esteja em attributesForFaceting no Algolia.
 */
export async function fetchCategoriasDisponiveis(): Promise<string[]> {
  try {
    const { results } = await searchClient.search({
      requests: [
        {
          indexName: INDEX_NAME,
          query: '',
          hitsPerPage: 0,
          facets: ['categorias'],
          maxValuesPerFacet: 50,
        },
      ],
    });
    const first = results[0] as { facets?: Record<string, Record<string, number>> };
    const facet = first?.facets?.categorias || {};
    return Object.entries(facet)
      .sort((a, b) => b[1] - a[1])
      .map(([slug]) => slug);
  } catch (e) {
    console.warn('Erro ao listar categorias:', e);
    return [];
  }
}

/**
 * Retorna o total de desenhos no índice (nbHits de uma busca vazia).
 * Usado na home para exibir a contagem real e dinâmica do acervo.
 */
export async function fetchTotalDesenhos(): Promise<number> {
  try {
    const { results } = await searchClient.search({
      requests: [{ indexName: INDEX_NAME, query: '', hitsPerPage: 0 }],
    });
    const first = results[0] as { nbHits?: number };
    return first?.nbHits || 0;
  } catch (e) {
    console.warn('[total] erro ao contar desenhos:', e);
    return 0;
  }
}

/**
 * Busca desenhos VARIADOS para a galeria animada do pack.
 *
 * Em vez de uma busca genérica (que traz os primeiros do índice e acaba
 * repetindo a mesma categoria), busca em paralelo dentro de cada categoria
 * e intercala os resultados. Assim o grid mostra sempre um mix: um animal,
 * um jogador, um personagem, um objeto...
 *
 * Roda no servidor (Server Component) — as imagens vêm no HTML (bom p/ SEO).
 */
export async function fetchDesenhosGaleria(porCategoria = 6) {
  type Hit = {
    objectID: string;
    personagem: string;
    url_imagem: string;
    alt_pt?: string;
    categorias?: string;
  };

  try {
    // 1) descobre as categorias reais do índice
    const categorias = await fetchCategoriasDisponiveis();
    if (categorias.length === 0) return [];

    // 2) busca N desenhos de cada categoria, tudo numa requisição só
    const { results } = await searchClient.search({
      requests: categorias.map((cat) => ({
        indexName: INDEX_NAME,
        query: '',
        filters: `categorias:"${cat}"`,
        hitsPerPage: porCategoria,
        attributesToRetrieve: ['objectID', 'personagem', 'url_imagem', 'alt_pt', 'categorias'],
      })),
    });

    // 3) agrupa os hits por categoria
    const porCat: Hit[][] = results.map((r) => {
      const hits = ((r as { hits?: unknown[] }).hits || []) as Hit[];
      // embaralha dentro da categoria pra não pegar sempre os mesmos
      return hits.sort(() => Math.random() - 0.5);
    });

    // 4) INTERCALA: 1 de cada categoria por rodada (round-robin).
    //    Garante que os 4 primeiros (visíveis) sejam de categorias diferentes.
    const intercalado: Hit[] = [];
    const maxPorCat = Math.max(...porCat.map((c) => c.length), 0);

    for (let i = 0; i < maxPorCat; i++) {
      // embaralha a ORDEM das categorias a cada rodada
      const ordem = porCat
        .map((_, idx) => idx)
        .sort(() => Math.random() - 0.5);

      for (const catIdx of ordem) {
        const item = porCat[catIdx][i];
        if (item && item.url_imagem) intercalado.push(item);
      }
    }

    return intercalado;
  } catch {
    return [];
  }
}

/**
 * Personagens mais frequentes no acervo — usados como chips "Populares"
 * na home. Gerado no SERVIDOR (Server Component): o HTML já sai com os
 * links prontos, então o Google indexa e não custa JS no cliente.
 * Uma única requisição (facet), sem impacto em performance.
 */
export async function fetchPopularesHome(limit = 10): Promise<string[]> {
  try {
    const { results } = await searchClient.search({
      requests: [
        {
          indexName: INDEX_NAME,
          query: '',
          hitsPerPage: 0,
          facets: ['personagem'],
          maxValuesPerFacet: 100,
        },
      ],
    });
    const first = results[0] as { facets?: Record<string, Record<string, number>> };
    const facet = first?.facets?.personagem || {};

    return Object.entries(facet)
      .sort((a, b) => b[1] - a[1]) // mais desenhos primeiro
      .slice(0, limit)
      .map(([slug]) => slug);
  } catch {
    return [];
  }
}

/**
 * Desenhos variados para o carrossel largo da home.
 * Reaproveita a lógica de intercalar categorias (mesma da galeria do pack),
 * garantindo que o carrossel mostre um mix e não uma categoria só.
 */
export async function fetchDesenhosCarrosselHome(porCategoria = 8) {
  return fetchDesenhosGaleria(porCategoria);
}
