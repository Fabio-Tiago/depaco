'use client';

import { useEffect, useRef } from 'react';
import { autocomplete } from '@algolia/autocomplete-js';
import { searchClient, INDEX_NAME } from '@/lib/algolia';
import { formatarNome } from '@/lib/utils';
import '@algolia/autocomplete-theme-classic';

/**
 * Componente de busca com autocomplete instantâneo via Algolia.
 * Mostra thumbnails dos desenhos enquanto digita.
 * Ao clicar num resultado, navega direto pra página do desenho.
 *
 * IMPORTANTE: ao usar em produção, configura no painel Algolia:
 * - searchableAttributes: personagem, pose, cenario, composicao, pose_en, cenario_en
 * - typo tolerance: ativada (default)
 * - synonyms: bichinho->animal, super-herói->herói, etc
 */
export function SearchAutocomplete({
  placeholder = 'Buscar desenhos... ex: stitch, dinossauro, princesa',
  detachedMediaQuery = '(max-width: 640px)',
}: {
  placeholder?: string;
  detachedMediaQuery?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const search = autocomplete({
      container: containerRef.current,
      placeholder,
      detachedMediaQuery,
      openOnFocus: true,
      defaultActiveItemId: 0,
      classNames: {
        form: 'aa-Form',
        input: 'aa-Input',
        panel: 'aa-Panel',
      },
      getSources({ query }) {
        return [
          {
            sourceId: 'desenhos',
            getItems() {
              if (!query) return [];
              return searchClient
                .search({
                  requests: [
                    {
                      indexName: INDEX_NAME,
                      query,
                      hitsPerPage: 6,
                      attributesToRetrieve: [
                        'objectID',
                        'personagem',
                        'pose',
                        'cenario',
                        'idade_alvo',
                        'url_imagem',
                        'subject_slug',
                      ],
                    },
                  ],
                })
                .then((res: unknown) => {
                  const typed = res as { results: Array<{ hits: unknown[] }> };
                  return (typed.results[0]?.hits || []) as Record<string, string>[];
                });
            },
            getItemUrl({ item }) {
              return `/desenhos/${item.objectID}`;
            },
            templates: {
              item({ item, html }) {
                const url = item.url_imagem || '';
                const personagem = formatarNome((item.personagem as string) || '');
                const pose = (item.pose as string) || '';
                const idade = (item.idade_alvo as string) || '';

                return html`
                  <a
                    href="/desenhos/${item.objectID}"
                    class="flex items-center gap-3 p-2 hover:bg-mustard-50 rounded-lg transition-colors no-underline"
                  >
                    <div
                      class="w-14 h-14 rounded-lg bg-white border-2 border-ink shadow-chunky-sm flex-shrink-0 overflow-hidden"
                      style="background-image: url('${url}'); background-size: cover; background-position: center;"
                    ></div>
                    <div class="flex-1 min-w-0">
                      <div class="font-bold text-ink truncate">${personagem}</div>
                      <div class="text-sm text-ink/60 truncate">${pose}</div>
                      <div class="text-xs text-coral font-semibold mt-0.5">${idade}</div>
                    </div>
                  </a>
                `;
              },
              noResults() {
                return 'Nenhum desenho encontrado. Tenta outro termo!';
              },
              header() {
                return 'Resultados';
              },
            },
          },
        ];
      },
      onSubmit({ state }) {
        if (state.query) {
          window.location.href = `/buscar?q=${encodeURIComponent(state.query)}`;
        }
      },
    });

    return () => {
      search.destroy();
    };
  }, [placeholder, detachedMediaQuery]);

  return <div ref={containerRef} className="w-full" />;
}
