import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { PACKS, formatBRL, calcDesconto } from '@/lib/oferta';

export const metadata: Metadata = {
  title: 'Packs de desenhos para colorir',
  description:
    'Escolha um pack completo de desenhos para colorir em PDF: pack geral, esporte e mais temas. Pronto para imprimir, acesso imediato.',
  alternates: { canonical: '/packs' },
};

export default function PacksPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Cabeçalho */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-terracotta text-cream rounded-full text-sm font-bold mb-4">
          <Sparkles className="w-4 h-4" /> PACKS COMPLETOS
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-[1.05] mb-4">
          Escolha seu <span className="text-terracotta">pack de desenhos</span>
        </h1>
        <p className="text-lg text-ink/70">
          PDFs prontos para imprimir, organizados por tema. Acesso imediato e 7 dias de garantia.
        </p>
      </div>

      {/* Grade de packs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PACKS.map((pack) => {
          const desconto = pack.preco_de ? calcDesconto(pack.preco_de, pack.preco) : 0;
          return (
            <div
              key={pack.id}
              className="flex flex-col bg-white border-2 border-ink rounded-3xl shadow-chunky-lg overflow-hidden"
            >
              <div className="bg-gradient-to-br from-mustard-100 to-coral-100 p-6 border-b-2 border-ink">
                <h2 className="font-display text-2xl font-bold text-ink leading-tight mb-1">
                  {pack.nome}
                </h2>
                <p className="text-sm text-ink/70">{pack.descricao}</p>
              </div>

              <div className="flex-1 flex flex-col p-6">
                <p className="text-sm font-bold text-coral mb-3">
                  {pack.total_desenhos} desenhos
                </p>

                <div className="flex items-baseline gap-2 mb-4">
                  {pack.preco_de && (
                    <span className="text-ink/40 line-through text-sm">
                      {formatBRL(pack.preco_de)}
                    </span>
                  )}
                  <span className="text-3xl font-display font-bold text-terracotta">
                    {formatBRL(pack.preco)}
                  </span>
                  {desconto > 0 && (
                    <span className="px-2 py-0.5 bg-mustard text-ink rounded-md text-xs font-bold border border-ink">
                      -{desconto}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-ink/60 mb-6">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 7 dias garantia
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Acesso imediato
                  </span>
                </div>

                <Link
                  href={`/pack/${pack.id}`}
                  className="mt-auto block w-full px-6 py-4 bg-terracotta text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky text-center hover:translate-y-[-2px] hover:shadow-chunky-lg transition-all"
                >
                  Ver pack →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
