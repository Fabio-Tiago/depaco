'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Desenho = {
  objectID: string;
  personagem: string;
  url_imagem: string;
  alt_pt?: string;
  categorias?: string;
};

/**
 * Carrossel largo da home (full-bleed, ocupa a largura da tela).
 *
 * Duas camadas de movimento:
 *  1. O trilho ROLA continuamente (CSS, suave e infinito).
 *  2. As imagens TROCAM periodicamente (a cada 4s um punhado de cards
 *     recebe um desenho novo) — passa a sensação de acervo enorme.
 *
 * SEO: os cards iniciais vêm renderizados do servidor (HTML com alt e
 * link real para /desenhos/[id]), então o Google indexa. O movimento é
 * só enriquecimento visual no cliente.
 */
export function CarrosselHome({ desenhos }: { desenhos: Desenho[] }) {
  // quantos cards ficam visíveis no trilho
  const VISIVEIS = 10;

  const [slots, setSlots] = useState<number[]>(() =>
    Array.from({ length: VISIVEIS }, (_, i) => i % Math.max(desenhos.length, 1))
  );

  useEffect(() => {
    if (desenhos.length <= VISIVEIS) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    // a cada 4s, troca 3 cards aleatórios por desenhos que não estão na tela
    const timer = setInterval(() => {
      setSlots((prev) => {
        const naTela = new Set(prev);
        const disponiveis = desenhos
          .map((_, i) => i)
          .filter((i) => !naTela.has(i));

        if (disponiveis.length === 0) return prev;

        const novo = [...prev];
        const quantos = Math.min(3, disponiveis.length);

        for (let n = 0; n < quantos; n++) {
          const slotAleatorio = Math.floor(Math.random() * VISIVEIS);
          const idx = Math.floor(Math.random() * disponiveis.length);
          novo[slotAleatorio] = disponiveis[idx];
          disponiveis.splice(idx, 1);
        }
        return novo;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [desenhos]);

  if (desenhos.length === 0) return null;

  // duplica os cards para o loop do scroll ficar contínuo
  const cards = [...slots, ...slots];

  return (
    <section
      className="carrossel-home relative w-full overflow-hidden border-y-2 border-ink bg-cream py-6 mb-16"
      aria-label="Alguns desenhos do acervo"
    >
      <div className="carrossel-home-track flex gap-4 w-max px-4">
        {cards.map((idx, pos) => {
          const d = desenhos[idx] || desenhos[0];
          return (
            <Link
              key={`${pos}-${d.objectID}`}
              href={`/desenhos/${d.objectID}`}
              className="shrink-0 w-40 md:w-52 aspect-square bg-white border-2 border-ink rounded-2xl shadow-chunky-sm overflow-hidden relative desenho-limpo hover:-translate-y-1 transition-transform"
            >
              <Image
                key={d.objectID}
                src={d.url_imagem}
                alt={d.alt_pt || `Desenho de ${d.personagem} para colorir`}
                fill
                sizes="(max-width: 768px) 160px, 208px"
                className="object-contain p-2 animate-fade-in"
                loading="lazy"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
