'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resolverAltDesenho } from '@/lib/utils';

type Desenho = {
  objectID: string;
  personagem: string;
  pose: string;
  url_imagem: string;
};

/**
 * Carrossel de desenhos com scroll automático lento via CSS.
 * O HTML já vem renderizado do servidor (bom pra SEO).
 * A animação é puro CSS — não bloqueia carregamento nem main thread.
 * Pausa ao passar o mouse. Ao clicar, vai pra página do desenho.
 */
export function BlogCarrossel({ desenhos }: { desenhos: Desenho[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!desenhos.length) return null;

  // Duplica a lista para o loop infinito ficar contínuo
  const loop = [...desenhos, ...desenhos];

  return (
    <div
      className="blog-carrossel relative overflow-hidden border-2 border-ink rounded-2xl bg-cream shadow-chunky-sm my-8"
      aria-label="Desenhos para colorir relacionados"
    >
      <div ref={trackRef} className="blog-carrossel-track flex gap-4 py-4 px-4 w-max">
        {loop.map((d, i) => (
          <Link
            key={`${d.objectID}-${i}`}
            href={`/desenhos/${d.objectID}`}
            className="flex-shrink-0 w-40 group"
            aria-label={`Colorir ${d.personagem}`}
          >
            <div className="aspect-square relative bg-white border-2 border-ink rounded-xl overflow-hidden shadow-chunky-sm group-hover:-translate-y-1 transition-transform">
              <Image
                src={d.url_imagem}
                alt={resolverAltDesenho(d)}
                fill
                sizes="160px"
                className="object-contain p-2"
                loading="lazy"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
