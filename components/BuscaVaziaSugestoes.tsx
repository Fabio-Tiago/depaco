'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useInstantSearch } from 'react-instantsearch';
import { searchClient, INDEX_NAME } from '@/lib/algolia';
import { DesenhoCard } from '@/components/DesenhoCard';
import type { AlgoliaDesenhoRecord } from '@/types';

/**
 * Busca vazia inteligente.
 *
 * Quando o Algolia não retorna resultados para o termo pesquisado, em vez
 * de deixar a página vazia (e o visitante ir embora), sugerimos desenhos
 * populares do acervo. A pessoa que procurou algo que não temos ainda vê
 * conteúdo relevante, se interessa e baixa.
 *
 * Também mostra atalhos para os personagens mais buscados, dando um
 * caminho claro de navegação.
 */
export function BuscaVaziaSugestoes() {
  const { results, status } = useInstantSearch();
  const [sugestoes, setSugestoes] = useState<AlgoliaDesenhoRecord[]>([]);
  const [carregando, setCarregando] = useState(false);

  const termo = results?.query || '';
  const semResultados =
    status === 'idle' && results?.nbHits === 0 && termo.trim() !== '';

  useEffect(() => {
    if (!semResultados || sugestoes.length > 0) return;

    let cancelado = false;
    setCarregando(true);

    // Busca uma amostra variada do acervo para sugerir
    (async () => {
      try {
        const { results: res } = await searchClient.search({
          requests: [
            {
              indexName: INDEX_NAME,
              query: '',
              hitsPerPage: 12,
              attributesToRetrieve: [
                'objectID',
                'personagem',
                'pose',
                'cenario',
                'idade_alvo',
                'url_imagem',
                'subject_slug',
                'alt_pt',
                'categorias',
              ],
            },
          ],
        });
        if (cancelado) return;
        const hits = ((res[0] as { hits?: unknown[] })?.hits ||
          []) as AlgoliaDesenhoRecord[];
        setSugestoes(hits);
      } catch {
        // silencioso: se falhar, a seção simplesmente não aparece
      } finally {
        if (!cancelado) setCarregando(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [semResultados, sugestoes.length]);

  if (!semResultados) return null;

  return (
    <div className="py-8">
      {/* Mensagem honesta sobre o termo não encontrado */}
      <div className="bg-mustard-100 border-2 border-ink rounded-2xl p-6 mb-8 text-center shadow-chunky-sm">
        <p className="text-lg text-ink mb-1">
          Ainda não temos desenhos para{' '}
          <span className="font-bold">&ldquo;{termo}&rdquo;</span>. 😕
        </p>
        <p className="text-ink/70">
          Mas dá uma olhada nesses aqui — a criançada costuma amar! 👇
        </p>
      </div>

      {carregando && (
        <p className="text-center text-ink/50 py-8">Carregando sugestões...</p>
      )}

      {sugestoes.length > 0 && (
        <>
          <h2 className="font-display text-2xl font-bold text-ink mb-4">
            Desenhos que você pode gostar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {sugestoes.map((d) => (
              <DesenhoCard key={d.objectID} desenho={d} />
            ))}
          </div>
        </>
      )}

      {/* Caminho de navegação alternativo */}
      <div className="text-center">
        <p className="text-ink/70 mb-3">Ou explore por aqui:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/buscar"
            className="px-4 py-2 bg-white border-2 border-ink rounded-full font-bold text-sm shadow-chunky-sm hover:-translate-y-0.5 transition-all"
          >
            Ver todos os desenhos
          </Link>
          <Link
            href="/categorias/animal"
            className="px-4 py-2 bg-white border-2 border-ink rounded-full font-bold text-sm shadow-chunky-sm hover:-translate-y-0.5 transition-all"
          >
            🐾 Animais
          </Link>
          <Link
            href="/categorias/personagem"
            className="px-4 py-2 bg-white border-2 border-ink rounded-full font-bold text-sm shadow-chunky-sm hover:-translate-y-0.5 transition-all"
          >
            🧸 Personagens Fofos
          </Link>
        </div>
      </div>
    </div>
  );
}
