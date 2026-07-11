'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Pagination,
  Configure,
  Stats,
} from 'react-instantsearch';
import { searchClient, INDEX_NAME } from '@/lib/algolia';
import { DesenhoCard } from '@/components/DesenhoCard';
import { OfertaCard } from '@/components/OfertaCard';
import { BuscaVaziaSugestoes } from '@/components/BuscaVaziaSugestoes';
import type { AlgoliaDesenhoRecord } from '@/types';

function Hit({ hit }: { hit: AlgoliaDesenhoRecord }) {
  return <DesenhoCard desenho={hit} />;
}

function BuscarContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <InstantSearch
        searchClient={searchClient}
        indexName={INDEX_NAME}
        initialUiState={{ [INDEX_NAME]: { query } }}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure hitsPerPage={24} />

        {/* Header com search + stats */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
            Buscar desenhos
          </h1>

          <div className="bg-white border-2 border-ink rounded-2xl shadow-chunky-sm overflow-hidden">
            <SearchBox
              placeholder="Digite o personagem, animal ou tema..."
              classNames={{
                root: '',
                form: 'flex items-center',
                input:
                  'flex-1 px-4 py-3 text-base font-medium text-ink placeholder:text-ink/40 bg-transparent border-0 outline-none',
                submit: 'px-4 text-ink/60',
                reset: 'px-4 text-ink/60',
                submitIcon: 'w-5 h-5',
                resetIcon: 'w-4 h-4',
              }}
            />
          </div>

          <div className="mt-2 text-sm text-ink/60">
            <Stats
              translations={{
                rootElementText({ nbHits }) {
                  return nbHits === 0
                    ? 'Nenhum resultado'
                    : `${nbHits.toLocaleString('pt-BR')} ${nbHits === 1 ? 'desenho encontrado' : 'desenhos encontrados'}`;
                },
              }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Filtros laterais */}
          <aside className="space-y-6">
            <FilterGroup title="Idade">
              <RefinementList
                attribute="idade_alvo_raw"
                classNames={{
                  list: 'space-y-1',
                  item: '',
                  label: 'flex items-center gap-2 cursor-pointer text-sm py-1.5 hover:text-coral',
                  checkbox: 'w-4 h-4 accent-terracotta',
                  labelText: 'flex-1',
                  count: 'text-xs text-ink/40 bg-ink/5 px-1.5 py-0.5 rounded',
                }}
                transformItems={(items) =>
                  items.map((i) => ({ ...i, label: i.label.replace(/_/g, ' ') }))
                }
              />
            </FilterGroup>

            <FilterGroup title="Tipo de Pose">
              <RefinementList
                attribute="pose_tipo"
                classNames={{
                  list: 'space-y-1',
                  label: 'flex items-center gap-2 cursor-pointer text-sm py-1.5 hover:text-coral',
                  checkbox: 'w-4 h-4 accent-terracotta',
                  labelText: 'flex-1 capitalize',
                  count: 'text-xs text-ink/40 bg-ink/5 px-1.5 py-0.5 rounded',
                }}
              />
            </FilterGroup>

            <FilterGroup title="Personagem">
              <RefinementList
                attribute="subject_slug"
                limit={10}
                showMore
                classNames={{
                  list: 'space-y-1',
                  label: 'flex items-center gap-2 cursor-pointer text-sm py-1.5 hover:text-coral',
                  checkbox: 'w-4 h-4 accent-terracotta',
                  labelText: 'flex-1 capitalize',
                  count: 'text-xs text-ink/40 bg-ink/5 px-1.5 py-0.5 rounded',
                  showMore: 'text-xs font-bold text-coral mt-2 hover:underline',
                }}
                translations={{
                  showMoreButtonText({ isShowingMore }) {
                    return isShowingMore ? 'Mostrar menos' : 'Ver mais';
                  },
                }}
              />
            </FilterGroup>

            <div className="hidden lg:block">
              <OfertaCard variant="sidebar" />
            </div>
          </aside>

          {/* Resultados */}
          <div>
            <Hits
              hitComponent={Hit}
              classNames={{
                root: '',
                list: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4',
                item: '',
                // some com o "nenhum resultado" padrão: quem cuida disso
                // agora é o BuscaVaziaSugestoes logo abaixo
                emptyRoot: 'hidden',
              }}
            />

            {/* Busca sem resultado -> sugere desenhos em vez de página vazia */}
            <BuscaVaziaSugestoes />

            <div className="mt-10 flex justify-center">
              <Pagination
                classNames={{
                  root: 'flex',
                  list: 'flex items-center gap-1',
                  item: '',
                  link: 'inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-ink/10 font-bold hover:border-ink hover:bg-mustard-50 transition-colors',
                  selectedItem: '!bg-terracotta !text-cream !border-ink',
                  disabledItem: 'opacity-40 pointer-events-none',
                }}
              />
            </div>
          </div>
        </div>
      </InstantSearch>

      <div className="h-20 lg:hidden" />
      <OfertaCard variant="sticky-mobile" />
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-ink rounded-2xl p-4 shadow-chunky-sm">
      <h3 className="font-display font-bold text-ink mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Carregando...</div>}>
      <BuscarContent />
    </Suspense>
  );
}
