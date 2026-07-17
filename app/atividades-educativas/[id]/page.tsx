import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { getAtividadeById, getAtividadesPorTipo, ATIVIDADES } from '@/lib/atividades-data';
import GeradorCacaPalavras from '@/components/GeradorCacaPalavras';
import GeradorLabirinto from '@/components/GeradorLabirinto';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 86400;

// Gera as rotas estáticas de todas as atividades (bom pra SEO/build)
export async function generateStaticParams() {
  return ATIVIDADES.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const a = getAtividadeById(id);
  if (!a) return { title: 'Atividade não encontrada' };

  return {
    title: `${a.titulo} e Jogar Online Grátis | DEPACO`,
    description: a.meta_desc,
    alternates: { canonical: `/atividades-educativas/${a.id}` },
    openGraph: {
      title: a.titulo,
      description: a.meta_desc,
      type: 'article',
    },
  };
}

export default async function AtividadePage({ params }: PageProps) {
  const { id } = await params;
  const a = getAtividadeById(id);
  if (!a) notFound();

  // outras atividades do mesmo tipo (links internos)
  const relacionadas = getAtividadesPorTipo(a.tipo)
    .filter((x) => x.id !== a.id)
    .slice(0, 8);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: a.titulo,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
    description: a.meta_desc,
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
          <Link href="/atividades-educativas" className="hover:text-coral">
            Atividades Educativas
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/atividades-educativas/categoria/${a.tipo}`} className="hover:text-coral">
            {a.tipo_nome}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink/40 truncate">{a.tema}</span>
        </nav>

        {/* Título */}
        <h1 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-3">
          {a.tipo_nome} de {a.tema}{' '}
          <span className="text-coral">para baixar</span>
        </h1>
        <p className="text-lg text-ink/70 mb-8 max-w-2xl">{a.meta_desc}</p>

        {/* A ferramenta — escolhe o gerador conforme o tipo.
            Caça-palavras e labirinto são jogáveis; os outros
            mostram um botão de baixar (versão imprimível). */}
        {a.tipo === 'caca-palavras' ? (
          <GeradorCacaPalavras />
        ) : a.tipo === 'labirinto' ? (
          <GeradorLabirinto />
        ) : (
          <div className="rounded-3xl border-[3px] border-ink bg-cream p-8 text-center shadow-chunky">
            <p className="text-lg font-bold text-ink mb-4">
              {a.tipo_nome} de {a.tema} pronto para baixar
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-coral text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky hover:-translate-y-1 transition-all">
              ⬇️ Baixar atividade
            </button>
          </div>
        )}

        {/* BANNER DA OFERTA */}
        <section className="mt-12 rounded-3xl border-[3px] border-ink bg-mustard p-6 md:p-8 shadow-chunky">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">
                Leve 1921 atividades de uma vez
              </h2>
              <p className="text-ink/80 leading-relaxed">
                {a.tipo_nome}, caça-palavras, cruzadinhas, labirintos e muito mais —
                organizados por idade e prontos para baixar.
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

        {/* TEXTO SEO ÚNICO */}
        <div className="mt-12 prose prose-ink max-w-none">
          <h2 className="font-display text-2xl font-bold text-ink mb-3">
            Sobre esta atividade
          </h2>
          <p className="text-ink/80 leading-relaxed">{a.texto_seo}</p>

          <h2 className="font-display text-2xl font-bold text-ink mt-8 mb-3">
            Como usar
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-ink/80">
            <li>Clique em baixar para salvar a atividade no seu aparelho</li>
            <li>Imprima em folha A4 comum</li>
            <li>Entregue para a criança com lápis ou canetinha</li>
            <li>Acompanhe e ajude quando precisar</li>
          </ol>
        </div>

        {/* LINKS INTERNOS — outras do mesmo tipo */}
        {relacionadas.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold text-ink mb-4">
              Mais {a.tipo_nome.toLowerCase()} para baixar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relacionadas.map((r) => (
                <Link
                  key={r.id}
                  href={`/atividades-educativas/${r.id}`}
                  className="flex items-center justify-center text-center px-4 py-5 bg-cream border-2 border-ink rounded-2xl font-bold text-ink shadow-chunky-sm hover:shadow-chunky hover:-translate-y-1 transition-all"
                >
                  {r.tema}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
