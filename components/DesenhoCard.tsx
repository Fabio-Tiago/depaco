import Image from 'next/image';
import Link from 'next/link';
import { formatarNome, resolverAltDesenho } from '@/lib/utils';
import type { AlgoliaDesenhoRecord } from '@/types';

/**
 * Card de desenho para grids e listagens.
 * Otimizado pra carregamento: usa next/image, lazy por padrão.
 */
export function DesenhoCard({
  desenho,
  priority = false,
}: {
  desenho: Partial<AlgoliaDesenhoRecord>;
  priority?: boolean;
}) {
  if (!desenho.objectID) return null;

  return (
    <Link
      href={`/desenhos/${desenho.objectID}`}
      className="group block bg-white border-2 border-ink rounded-2xl overflow-hidden shadow-chunky-sm hover:shadow-chunky hover:-translate-y-1 transition-all"
    >
      <div className="aspect-square bg-cream relative overflow-hidden">
        {desenho.url_imagem && (
          <Image
            src={desenho.url_imagem}
            alt={resolverAltDesenho(desenho)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
        )}
      </div>
      <div className="p-3 border-t-2 border-ink/10">
        <p className="font-display font-bold text-ink truncate">
          {formatarNome(desenho.personagem || '')}
        </p>
        {desenho.pose && (
          <p className="text-xs text-ink/60 truncate mt-0.5">{desenho.pose}</p>
        )}
        {desenho.idade_alvo_raw && (
          <span className="inline-block mt-1.5 px-2 py-0.5 bg-mustard-100 text-ink text-[10px] font-bold rounded-full">
            {desenho.idade_alvo_raw.replace(/_/g, ' ')}
          </span>
        )}
      </div>
    </Link>
  );
}
