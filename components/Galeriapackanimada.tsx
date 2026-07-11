'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Desenho = {
  objectID: string;
  personagem: string;
  url_imagem: string;
  alt_pt?: string;
};

/**
 * Galeria animada do pack: mostra 4 desenhos num grid e vai trocando
 * UM card de cada vez (escalonado), a cada ~3s, criando um slideshow
 * suave que não pisca tudo junto.
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

    let slotAtual = 0;

    const timer = setInterval(() => {
      setSlots((prev) => {
        const usados = new Set(prev);
        // acha um desenho do pool que não está visível agora
        let proximo = -1;
        for (let tentativa = 0; tentativa < desenhos.length; tentativa++) {
          const cand = Math.floor(Math.random() * desenhos.length);
          if (!usados.has(cand)) {
            proximo = cand;
            break;
          }
        }
        if (proximo === -1) return prev;

        const novo = [...prev];
        novo[slotAtual] = proximo;
        slotAtual = (slotAtual + 1) % 4; // próximo card na próxima vez
        return novo;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [temPool, desenhos.length]);

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
