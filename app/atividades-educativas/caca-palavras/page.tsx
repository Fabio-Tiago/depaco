import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import GeradorCacaPalavras from '@/components/GeradorCacaPalavras';

export const metadata: Metadata = {
  title: 'Caça-Palavras para Imprimir e Jogar Online Grátis | DEPACO',
  description:
    'Gere caça-palavras grátis por tema e dificuldade. Jogue online no celular ou imprima em PDF. Ideal para crianças na alfabetização e para professores.',
  alternates: {
    canonical: '/atividades-educativas/caca-palavras',
  },
};

export default function CacaPalavrasPage() {
  // Schema.org — ajuda o Google a entender que é uma ferramenta gratuita
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Gerador de Caça-Palavras DEPACO',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
    description:
      'Gerador gratuito de caça-palavras para crianças. Jogue online ou imprima.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-sm text-ink/60 mb-6"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-coral inline-flex items-center gap-1">
            <HomeIcon className="w-3.5 h-3.5" /> Início
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/atividades-educativas" className="hover:text-coral">
            Atividades Educativas
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink/40">Caça-Palavras</span>
        </nav>

        {/* Título */}
        <h1 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-3">
          Caça-Palavras <span className="text-coral">para imprimir e jogar online</span>
        </h1>
        <p className="text-lg text-ink/70 mb-8 max-w-2xl">
          Escolha um tema, jogue direto na tela ou imprima para levar para a
          escola e para casa. Grátis, sem cadastro.
        </p>

        {/* A FERRAMENTA */}
        <GeradorCacaPalavras />

        {/* BANNER DA OFERTA — depois do valor entregue */}
        <section className="mt-12 rounded-3xl border-[3px] border-ink bg-mustard p-6 md:p-8 shadow-chunky">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">
                Gostou? Leve 1921 atividades de uma vez
              </h2>
              <p className="text-ink/80 leading-relaxed">
                Caça-palavras, cruzadinhas, labirintos, jogos da memória e muito
                mais — organizados por idade e prontos para imprimir. Nunca mais
                monte uma atividade por vez.
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
        <div className="mt-12 prose prose-ink max-w-none">
          <h2 className="font-display text-2xl font-bold text-ink mb-3">
            Como usar o gerador de caça-palavras
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-ink/80">
            <li>Escolha um tema (animais, frutas, material escolar e outros)</li>
            <li>Selecione a dificuldade conforme a idade da criança</li>
            <li>Jogue na tela: arraste o dedo ou o mouse sobre as palavras</li>
            <li>Clique em &quot;Imprimir&quot; para levar a atividade no papel</li>
          </ol>

          <h2 className="font-display text-2xl font-bold text-ink mt-8 mb-3">
            Benefícios do caça-palavras para crianças
          </h2>
          <p className="text-ink/80 leading-relaxed">
            O caça-palavras trabalha a atenção, o reconhecimento de letras e a
            ampliação do vocabulário — habilidades importantes na fase de
            alfabetização. Por unir desafio e diversão, prende a atenção da
            criança e pode ser usado em casa ou em sala de aula como recurso
            pedagógico. A versão por temas ajuda a fixar conjuntos de palavras
            (como nomes de animais ou frutas) de forma lúdica.
          </p>

          <h2 className="font-display text-2xl font-bold text-ink mt-8 mb-3">
            Perguntas frequentes
          </h2>
          <div className="space-y-4 text-ink/80">
            <div>
              <h3 className="font-bold text-ink">O caça-palavras é grátis?</h3>
              <p>Sim. Você pode gerar e imprimir quantos quiser, sem cadastro.</p>
            </div>
            <div>
              <h3 className="font-bold text-ink">Funciona no celular?</h3>
              <p>
                Funciona. É só arrastar o dedo sobre as letras para marcar as
                palavras.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink">Para qual idade é indicado?</h3>
              <p>
                A partir dos 5 anos. Use a dificuldade &quot;fácil&quot; para os
                menores e &quot;difícil&quot; para os maiores.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink">Posso usar na escola?</h3>
              <p>
                Sim. Professores podem imprimir e distribuir para a turma
                livremente.
              </p>
            </div>
          </div>
        </div>

        {/* LINKS INTERNOS — cluster de atividades */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-ink mb-4">
            Outras atividades para imprimir
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { nome: 'Labirinto', href: '/atividades-educativas/labirinto' },
              { nome: 'Palavras Cruzadas', href: '/atividades-educativas/palavras-cruzadas' },
              { nome: 'Jogo da Memória', href: '/atividades-educativas/jogo-da-memoria' },
              { nome: 'Ligue os Pontos', href: '/atividades-educativas/ligue-os-pontos' },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-center text-center px-4 py-6 bg-cream border-2 border-ink rounded-2xl font-bold text-ink shadow-chunky-sm hover:shadow-chunky hover:-translate-y-1 transition-all"
              >
                {a.nome}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
