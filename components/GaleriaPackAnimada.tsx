'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Desenho = {
  objectID: string;
  personagem: string;
  url_imagem: string;
  alt_pt?: string;
  categorias?: string;
};

/**
 * Galeria animada do pack: mostra 4 desenhos num grid e troca TODOS
 * a cada 3s, com um leve escalonamento no fade (cada card entra com
 * um pequeno atraso). Trocar os 4 de uma vez comunica de imediato que
 * o acervo é grande — o usuário não precisa esperar um ciclo longo.
 *
 * Os desenhos chegam já INTERCALADOS por categoria (do servidor) e, a
 * cada troca, o componente sorteia um conjunto novo priorizando
 * categorias diferentes entre si (animal, jogador, personagem...).
 *
 * SEO: as 4 imagens iniciais vêm renderizadas do servidor (estão no
 * HTML com alt), então o Google as vê. A rotação é só enriquecimento
 * visual no cliente — não altera conteúdo indexável.
 */
export function GaleriaPackAnimada({
  desenhos,
  restante,
}: {
  desenhos: Desenho[];
  restante: number;
}) {
  // precisa de pelo menos 4; se vier menos, nem anima
  const temPool = desenhos.length > 4;

  // índices atualmente visíveis nos 4 slots
  const [slots, setSlots] = useState<number[]>([0, 1, 2, 3]);

  useEffect(() => {
    if (!temPool) return;

    // respeita quem prefere menos movimento (acessibilidade)
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    // Sorteia um conjunto NOVO de 4 desenhos, priorizando categorias
    // diferentes entre si e evitando repetir os que estão na tela.
    function sortearQuatro(atuais: number[]): number[] {
      const naTela = new Set(atuais);
      const escolhidos: number[] = [];
      const catsUsadas = new Set<string>();

      // pool embaralhado, sem os que já estão visíveis
      const pool = desenhos
        .map((d, i) => ({ d, i }))
        .filter(({ i }) => !naTela.has(i))
        .sort(() => Math.random() - 0.5);

      // 1ª passada: um de cada categoria (garante variedade)
      for (const { d, i } of pool) {
        if (escolhidos.length === 4) break;
        const cat = d.categorias || '';
        if (!catsUsadas.has(cat)) {
          escolhidos.push(i);
          catsUsadas.add(cat);
        }
      }

      // 2ª passada: se faltou preencher, aceita repetir categoria
      if (escolhidos.length < 4) {
        for (const { i } of pool) {
          if (escolhidos.length === 4) break;
          if (!escolhidos.includes(i)) escolhidos.push(i);
        }
      }

      // se ainda faltar (pool pequeno), completa com os atuais
      while (escolhidos.length < 4) {
        escolhidos.push(atuais[escolhidos.length]);
      }

      return escolhidos;
    }

    // Troca os 4 de uma vez a cada 3s — comunica volume de imediato
    const timer = setInterval(() => {
      setSlots((prev) => sortearQuatro(prev));
    }, 3000);

    return () => clearInterval(timer);
  }, [temPool, desenhos]);

  // fallback: se não houver desenhos, mostra os emojis antigos
  if (desenhos.length === 0) {
    const emojis = ['🎨', '🦄', '🚀', '🦁'];
    return (
      <div className="relative">
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square bg-white border-2 border-ink rounded-2xl shadow-chunky overflow-hidden flex items-center justify-center text-6xl"
              style={{ transform: `rotate(${i % 2 === 0 ? '-2deg' : '2deg'})` }}
            >
              {emojis[i]}
            </div>
          ))}
        </div>
        {restante > 0 && (
          <div className="absolute -top-3 -right-3 bg-mustard border-2 border-ink rounded-2xl px-3 py-2 shadow-chunky-sm rotate-6">
            <p className="text-xs font-bold text-ink">+ {restante}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-3">
        {slots.map((idx, slot) => {
          const d = desenhos[idx] || desenhos[0];
          return (
            <div
              key={slot}
              className="aspect-square bg-white border-2 border-ink rounded-2xl shadow-chunky overflow-hidden relative desenho-limpo"
              style={{ transform: `rotate(${slot % 2 === 0 ? '-2deg' : '2deg'})` }}
            >
              <Image
                key={d.objectID}
                src={d.url_imagem}
                alt={d.alt_pt || `Desenho de ${d.personagem} para colorir`}
                fill
                sizes="(max-width: 1024px) 45vw, 22vw"
                className="object-contain p-2 animate-fade-in"
                loading="lazy"
                // micro-atraso por card: os 4 trocam juntos, mas entram
                // em cascata suave (0ms, 80ms, 160ms, 240ms)
                style={{ animationDelay: `${slot * 80}ms` }}
              />
            </div>
          );
        })}
      </div>
      {restante > 0 && (
        <div className="absolute -top-3 -right-3 bg-mustard border-2 border-ink rounded-2xl px-3 py-2 shadow-chunky-sm rotate-6 z-10">
          <p className="text-xs font-bold text-ink">+ {restante}</p>
        </div>
      )}
    </div>
  );
}
