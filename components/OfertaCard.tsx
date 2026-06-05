import Link from 'next/link';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { PACK_PADRAO, formatBRL, calcDesconto } from '@/lib/oferta';
import type { PackOferta } from '@/types';


/**
 * Card de oferta — aparece em sidebar (desktop) ou fixed footer (mobile).
 * É a peça mais importante da estratégia de monetização.
 * SEMPRE visível em páginas de desenho individual, personagem, categoria.
 *
 * Variante "sidebar" = aparece na lateral em desktop
 * Variante "compact" = banner horizontal (Home, listagens)
 * Variante "sticky-mobile" = barra fixa no rodapé em mobile
 */

export function OfertaCard({
  variant = 'sidebar',
  pack = PACK_PADRAO,
}: {
  variant?: 'sidebar' | 'compact' | 'sticky-mobile';
  pack?: PackOferta;
}) {
  const desconto = pack.preco_de ? calcDesconto(pack.preco_de, pack.preco) : 0;
  if (variant === 'sticky-mobile') {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream border-t-2 border-ink shadow-[0_-8px_24px_-12px_rgba(31,31,31,0.2)]">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-coral leading-tight">PACK COMPLETO</p>
            <p className="font-display text-lg font-bold text-ink leading-none">
              {pack.total_desenhos} desenhos
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              {pack.preco_de && (
                <span className="text-xs text-ink/40 line-through">{formatBRL(pack.preco_de)}</span>
              )}
              <span className="text-base font-bold text-terracotta">{formatBRL(pack.preco)}</span>
            </div>
          </div>
          <Link
            href={`/pack/${pack.id}`}
            className="flex-shrink-0 px-4 py-3 bg-terracotta text-cream rounded-xl font-bold border-2 border-ink shadow-chunky-sm text-sm whitespace-nowrap"
          >
            QUERO →
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="relative bg-gradient-to-br from-mustard-100 to-coral-100 border-2 border-ink rounded-3xl shadow-chunky-lg p-6 md:p-8 overflow-hidden">
        {/* Decorações de fundo */}
        <div className="absolute top-4 right-4 text-mustard-400/30 text-7xl font-display font-bold rotate-12">
          ✦
        </div>
        <div className="absolute bottom-2 left-4 text-coral/20 text-5xl font-display font-bold -rotate-12">
          ★
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-terracotta text-cream rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-3 h-3" />
              OFERTA LIMITADA
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight mb-2">
              {pack.total_desenhos}+ desenhos prontos pra imprimir
            </h3>
            <p className="text-ink/70 mb-4">
              Variedade de personagens, animais, datas comemorativas. Tudo organizado por idade.
            </p>
            <div className="flex items-baseline gap-3">
              {pack.preco_de && (
                <span className="text-ink/40 line-through text-lg">{formatBRL(pack.preco_de)}</span>
              )}
              <span className="text-4xl font-display font-bold text-terracotta">
                {formatBRL(pack.preco)}
              </span>
              {desconto > 0 && (
                <span className="px-2 py-0.5 bg-mustard text-ink rounded-md text-xs font-bold border border-ink">
                  -{desconto}%
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/pack/${pack.id}`}
            className="w-full md:w-auto px-8 py-4 bg-terracotta text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky hover:translate-y-[-3px] hover:shadow-chunky-lg transition-all text-center"
          >
            QUERO O PACK COMPLETO →
          </Link>
        </div>
      </div>
    );
  }

  // sidebar (default)
  return (
    <aside className="bg-gradient-to-br from-mustard-50 to-coral-50 border-2 border-ink rounded-3xl shadow-chunky-lg p-6 sticky top-24">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-terracotta text-cream rounded-full text-xs font-bold mb-3">
        <Sparkles className="w-3 h-3" />
        PACK PREMIUM
      </div>

      <h3 className="font-display text-xl md:text-2xl font-bold text-ink leading-tight mb-3">
        Quer <span className="text-terracotta">{pack.total_desenhos} desenhos</span> como esse?
      </h3>

      <p className="text-sm text-ink/70 mb-4">
        Receba imediatamente um PDF com {pack.total_desenhos} desenhos exclusivos pra imprimir e colorir.
      </p>

      <ul className="space-y-2 mb-5 text-sm text-ink/80">
        <li className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
          <span>{pack.total_desenhos} páginas em PDF</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
          <span>Pronto pra imprimir em A4</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
          <span>Variedade de temas e idades</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
          <span>Acesso imediato após compra</span>
        </li>
      </ul>

      <div className="bg-cream rounded-2xl p-4 border-2 border-ink mb-4">
        {pack.preco_de && (
          <div className="flex items-center justify-between text-sm text-ink/50 mb-1">
            <span>De</span>
            <span className="line-through">{formatBRL(pack.preco_de)}</span>
          </div>
        )}
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-ink">Por apenas</span>
          <span className="text-3xl font-display font-bold text-terracotta">
            {formatBRL(pack.preco)}
          </span>
        </div>
        {desconto > 0 && (
          <p className="text-xs text-coral font-bold text-right mt-1">
            Você economiza {desconto}%!
          </p>
        )}
      </div>

      <Link
        href={`/pack/${pack.id}`}
        className="block w-full px-6 py-4 bg-terracotta text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky hover:translate-y-[-2px] hover:shadow-chunky-lg transition-all text-center text-lg"
      >
        QUERO O PACK →
      </Link>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-ink/60">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> 7 dias garantia
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" /> Entrega imediata
        </span>
      </div>
    </aside>
  );
}
