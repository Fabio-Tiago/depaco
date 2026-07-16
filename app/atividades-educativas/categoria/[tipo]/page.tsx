import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { getAtividadesPorTipo, TIPOS } from '@/lib/atividades-data';
import GeradorCacaPalavras from '@/components/GeradorCacaPalavras';

interface PageProps {
  params: Promise<{ tipo: string }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  return TIPOS.map((t) => ({ tipo: t.tipo }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tipo } = await params;
  const info = TIPOS.find((t) => t.tipo === tipo);
  if (!info) return { title: 'Categoria não encontrada' };

  return {
    title: `${info.nome} para Imprimir e Jogar Online Grátis | DEPACO`,
    description: `${info.total} atividades de ${info.nome.toLowerCase()} grátis para imprimir e jogar online. Por tema e dificuldade, para crianças.`,
    alternates: { canonical: `/atividades-educativas/categoria/${tipo}` },
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  const { tipo } = await params;
  const info = TIPOS.find((t) => t.tipo === tipo);
  if (!info) notFound();

  const atividades = getAtividadesPorTipo(tipo);

  return (
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
        <span className="text-ink/40">{info.nome}</span>
      </nav>

      <h1 className="font-display text-3xl md:text-5xl font-bold text-ink leading-tight mb-3">
        {info.nome} <span className="text-coral">para imprimir</span>
      </h1>
      <p className="text-lg text-ink/70 mb-8 max-w-2xl">
        {info.total} atividades de {info.nome.toLowerCase()} por tema. Jogue online
        ou imprima grátis.
      </p>

      {/* Se for caça-palavras, mostra o gerador jogável no topo */}
      {tipo === 'caca-palavras' && (
        <div className="mb-12">
          <GeradorCacaPalavras />
        </div>
      )}

      {/* Grade de temas (todas as atividades deste tipo) */}
      <h2 className="font-display text-2xl font-bold text-ink mb-4">
        Escolha um tema
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {atividades.map((a) => (
          <Link
            key={a.id}
            href={`/atividades-educativas/${a.id}`}
            className="flex flex-col items-center justify-center text-center px-4 py-6 bg-cream border-2 border-ink rounded-2xl font-bold text-ink shadow-chunky-sm hover:shadow-chunky hover:-translate-y-1 transition-all"
          >
            <span>{a.tema}</span>
            <span className="text-xs font-normal text-ink/50 mt-1">
              {a.n_itens} itens
            </span>
          </Link>
        ))}
      </div>

      {/* Links pras outras categorias */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink mb-4">
          Outros tipos de atividade
        </h2>
        <div className="flex flex-wrap gap-3">
          {TIPOS.filter((t) => t.tipo !== tipo).map((t) => (
            <Link
              key={t.tipo}
              href={`/atividades-educativas/categoria/${t.tipo}`}
              className="px-5 py-3 bg-mustard border-2 border-ink rounded-2xl font-bold text-ink shadow-chunky-sm hover:shadow-chunky hover:-translate-y-1 transition-all"
            >
              {t.nome}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
