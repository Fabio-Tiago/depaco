import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { TIPOS, ATIVIDADES } from '@/lib/atividades-data';

export const metadata: Metadata = {
  title: 'Atividades Educativas para Imprimir e Jogar Online Grátis | DEPACO',
  description:
    'Caça-palavras, cruzadinhas, labirintos, jogos da memória e mais. Atividades educativas grátis para imprimir e jogar online, por tema e idade.',
  alternates: { canonical: '/atividades-educativas' },
};

export default function AtividadesHome() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Atividades Educativas DEPACO',
    description:
      'Coleção de atividades educativas gratuitas para crianças: caça-palavras, cruzadinhas, labirintos e mais.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-ink/60 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-coral inline-flex items-center gap-1">
            <HomeIcon className="w-3.5 h-3.5" /> Início
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink/40">Atividades Educativas</span>
        </nav>

        <h1 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-3">
          Atividades Educativas{' '}
          <span className="text-coral">para imprimir e jogar</span>
        </h1>
        <p className="text-lg text-ink/70 mb-10 max-w-2xl">
          {ATIVIDADES.length} atividades grátis para crianças: caça-palavras,
          cruzadinhas, labirintos, jogos da memória e mais. Jogue online ou
          imprima em PDF.
        </p>

        {/* Categorias */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {TIPOS.map((t) => (
            <Link
              key={t.tipo}
              href={`/atividades-educativas/categoria/${t.tipo}`}
              className="flex flex-col items-center justify-center text-center px-6 py-8 bg-cream border-[3px] border-ink rounded-3xl font-bold text-ink shadow-chunky hover:-translate-y-1 transition-all"
            >
              <span className="font-display text-xl md:text-2xl">{t.nome}</span>
              <span className="text-sm font-normal text-ink/50 mt-1">
                {t.total} atividades
              </span>
            </Link>
          ))}
        </div>

        {/* BANNER DA OFERTA */}
        <section className="rounded-3xl border-[3px] border-ink bg-mustard p-6 md:p-8 shadow-chunky mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">
                Mega Pack: 1921 atividades organizadas
              </h2>
              <p className="text-ink/80 leading-relaxed">
                Todas as atividades por idade, com gabarito, prontas para
                imprimir. Nunca mais monte uma por vez.
              </p>
            </div>
            <Link
              href="/pack/mega-pack-atividades"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-coral text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky hover:-translate-y-1 transition-all whitespace-nowrap"
            >
              Ver o pack completo →
            </Link>
          </div>
        </section>

        {/* TEXTO SEO */}
        <div className="prose prose-ink max-w-none">
          <h2 className="font-display text-2xl font-bold text-ink mb-3">
            Atividades educativas para a alfabetização e o aprendizado
          </h2>
          <p className="text-ink/80 leading-relaxed">
            As atividades educativas ajudam as crianças a desenvolver a atenção,
            a coordenação motora e o raciocínio enquanto se divertem. No DEPACO
            você encontra caça-palavras, cruzadinhas, labirintos e jogos da
            memória organizados por tema — de animais e frutas a números e
            letras — para usar em casa ou na escola. Todas podem ser jogadas
            online ou impressas gratuitamente.
          </p>
        </div>
      </div>
    </>
  );
}
