import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Palette, Printer, Heart } from 'lucide-react';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';
import { OfertaCard } from '@/components/OfertaCard';
import { CarrosselHome } from '@/components/CarrosselHome';
import {
  fetchPersonagensUnicos,
  resolverCapaPost,
  fetchCategoriasDisponiveis,
  fetchTotalDesenhos,
  fetchPopularesHome,
  fetchDesenhosCarrosselHome,
} from '@/lib/algolia';
import { getAllBlogPosts } from '@/lib/blog';
import { capitalize } from '@/lib/utils';
import { getCategoriaMeta } from '@/lib/categorias';

// A home faz queries ao Algolia server-side. Forçamos renderização em
// runtime (não no build) para garantir que as env vars NEXT_PUBLIC_ALGOLIA_*
// estejam disponíveis — senão as seções de categorias/personagens vêm vazias.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Em paralelo: personagens + posts + categorias + total + populares + carrossel
  const [
    personagens,
    postsRaw,
    categoriasSlugs,
    totalDesenhos,
    popularesSlugs,
    desenhosCarrossel,
  ] = await Promise.all([
    fetchPersonagensUnicos(),
    Promise.resolve(getAllBlogPosts().slice(0, 3)),
    fetchCategoriasDisponiveis(),
    fetchTotalDesenhos(),
    fetchPopularesHome(10),
    fetchDesenhosCarrosselHome(8),
  ]);

  // Arredonda para baixo numa "casa redonda" para o selo "Mais de X".
  // Ex: 2312 -> 2.000 ; 9540 -> 9.000 ; 760 -> 500.
  function arredondarParaBaixo(n: number): number {
    if (n >= 1000) return Math.floor(n / 1000) * 1000;
    if (n >= 100) return Math.floor(n / 100) * 100;
    return n;
  }
  const totalRedondo = arredondarParaBaixo(totalDesenhos);
  const totalFormatado = totalRedondo.toLocaleString('pt-BR');

  // Categorias reais do Algolia + metadados visuais (nome/ícone/cor)
  const categoriasDestaque = categoriasSlugs.map(getCategoriaMeta);

  // Resolve a capa de cada post (acervo via related_personagem, ou fallback)
  const posts = await Promise.all(
    postsRaw.map(async (post) => ({
      ...post,
      capa: await resolverCapaPost({
        cover: post.cover,
        related_personagem: post.related_personagem,
      }),
    }))
  );

  const personagensDestaque = personagens.slice(0, 12);

  return (
    <>
      {/* === HERO === */}
      <section className="relative overflow-hidden">
        {/* Decorações de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 bg-mustard-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-coral-100/50 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-mustard-100 border-2 border-ink rounded-full mb-6 shadow-chunky-sm">
              <Sparkles className="w-4 h-4 text-terracotta" />
              <span className="text-sm font-bold text-ink">
                {totalRedondo > 0
                  ? `Mais de ${totalFormatado} desenhos prontos`
                  : 'Milhares de desenhos prontos'}
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-ink leading-[1.05] mb-6">
              Qual desenho você quer{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-terracotta">colorir</span>
                <span
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-mustard rounded-full -z-0"
                  style={{ transform: 'skewX(-6deg)' }}
                />
              </span>{' '}
              hoje?
            </h1>

            <p className="text-lg md:text-xl text-ink/70 mb-8 max-w-2xl mx-auto">
              Digite o personagem, animal ou tema. A criançada já está esperando 🎨
            </p>

            {/* Busca grande em destaque — versão home */}
            <div className="max-w-2xl mx-auto">
              <SearchAutocomplete placeholder="Digite: stitch, dinossauro, princesa, capivara..." />
            </div>

            {/* Atalhos populares — vêm do acervo real (Algolia, server-side).
                Se o Algolia falhar, cai numa lista fixa de segurança. */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-ink/50 font-medium">Populares:</span>
              {(popularesSlugs.length > 0
                ? popularesSlugs
                : ['stitch', 'homem-aranha', 'capivara', 'sonic', 'hello-kitty']
              ).map((p) => (
                <Link
                  key={p}
                  href={`/buscar?q=${p}`}
                  className="px-3 py-1 bg-white border-2 border-ink/10 rounded-full font-medium hover:border-ink hover:bg-mustard-50 transition-all"
                >
                  {capitalize(p.replace(/-/g, ' '))}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === OFERTA COMPACTA === */}
      <section className="container mx-auto px-4 mb-16">
        <OfertaCard variant="compact" />
      </section>

      {/* === CARROSSEL LARGO (full-bleed) === */}
      <CarrosselHome desenhos={desenhosCarrossel} />

      {/* === BENEFÍCIOS RÁPIDOS === */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Sparkles, title: '100% Grátis', desc: 'Baixe sem cadastro' },
            { icon: Printer, title: 'Pronto pra imprimir', desc: 'Tamanho A4' },
            { icon: Palette, title: 'Qualidade alta', desc: 'Linhas nítidas' },
            { icon: Heart, title: 'Feito com carinho', desc: 'Pra todas as idades' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border-2 border-ink rounded-2xl p-4 text-center shadow-chunky-sm"
            >
              <Icon className="w-6 h-6 text-coral mx-auto mb-2" />
              <p className="font-display font-bold text-ink text-sm">{title}</p>
              <p className="text-xs text-ink/60 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === CATEGORIAS === */}
      {categoriasDestaque.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="mb-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
              Explorar por categoria
            </h2>
            <p className="text-ink/60 mt-1">Encontre rapidinho o que está procurando</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriasDestaque.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}`}
                className={`${cat.cor} border-2 border-ink rounded-2xl p-4 text-center shadow-chunky-sm hover:shadow-chunky hover:-translate-y-1 transition-all`}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="font-display font-bold text-ink text-sm">{cat.nome}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* === PERSONAGENS POPULARES === */}
      {personagensDestaque.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
                Personagens favoritos
              </h2>
              <p className="text-ink/60 mt-1">Os mais procurados da galera</p>
            </div>
            <Link href="/buscar" className="hidden md:inline-flex text-coral font-bold hover:underline">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {personagensDestaque.map((p) => (
              <Link
                key={p.slug}
                href={`/personagem/${p.slug}`}
                className="group bg-white border-2 border-ink rounded-2xl p-4 text-center shadow-chunky-sm hover:shadow-chunky hover:-translate-y-1 transition-all"
              >
                <div className="aspect-square bg-mustard-50 rounded-xl mb-3 flex items-center justify-center text-4xl">
                  🎨
                </div>
                <p className="font-display font-bold text-ink text-sm truncate">
                  {capitalize(p.nome)}
                </p>
                <p className="text-xs text-ink/50 mt-0.5">{p.total} desenhos</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* === BLOG === */}
      {posts.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
                Dicas e ideias
              </h2>
              <p className="text-ink/60 mt-1">Conteúdos pra deixar a hora de colorir mais divertida</p>
            </div>
            <Link href="/blog" className="hidden md:inline-flex text-coral font-bold hover:underline">
              Ver todos →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-white border-2 border-ink rounded-2xl overflow-hidden shadow-chunky-sm hover:shadow-chunky hover:-translate-y-1 transition-all"
              >
                <div className="aspect-video bg-mustard-100 relative">
                  {post.capa && (
                    <Image
                      src={post.capa}
                      alt={post.title}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-ink mb-1 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-ink/60 line-clamp-2">{post.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Espaço para sticky-mobile não cobrir conteúdo */}
      <div className="h-20 lg:hidden" />
      <OfertaCard variant="sticky-mobile" />
    </>
  );
}
