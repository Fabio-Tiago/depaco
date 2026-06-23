import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { PACK_PADRAO, formatBRL, calcDesconto } from '@/lib/oferta';
import type { PackOferta } from '@/types';

/**
 * Banner de oferta compacto e horizontal — versão "Banner 2".
 * Menor que o OfertaCard compact. Pensado pro meio do post.
 */
export function BannerOfertaHorizontal({ pack = PACK_PADRAO }: { pack?: PackOferta }) {
  const desconto = pack.preco_de ? calcDesconto(pack.preco_de, pack.preco) : 0;

  return (
    <div className="my-8 bg-gradient-to-r from-mustard-100 to-coral-100 border-2 border-ink rounded-2xl shadow-chunky-sm px-5 py-4 flex flex-col sm:flex-row items-center gap-4">
      <div className="flex-1 min-w-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-terracotta text-cream rounded-full text-[10px] font-bold mb-1">
          <Sparkles className="w-3 h-3" /> OFERTA LIMITADA
        </span>
        <p className="font-display text-lg font-bold text-ink leading-tight">
          {pack.total_desenhos}+ desenhos prontos pra imprimir
        </p>
        <p className="text-xs text-ink/70">
          Variedade de personagens, animais e datas comemorativas.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          {pack.preco_de && (
            <span className="block text-xs text-ink/40 line-through leading-none">
              {formatBRL(pack.preco_de)}
            </span>
          )}
          <span className="text-xl font-display font-bold text-terracotta leading-none">
            {formatBRL(pack.preco)}
          </span>
          {desconto > 0 && (
            <span className="block text-[10px] text-coral font-bold">-{desconto}%</span>
          )}
        </div>
        <Link
          href={`/pack/${pack.id}`}
          className="px-4 py-3 bg-terracotta text-cream rounded-xl font-bold border-2 border-ink shadow-chunky-sm text-sm whitespace-nowrap hover:translate-y-[-2px] transition-all"
        >
          QUERO →
        </Link>
      </div>
    </div>
  );
}
