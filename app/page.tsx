import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Palette, Printer, Heart } from 'lucide-react';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';
import { OfertaCard } from '@/components/OfertaCard';
import { fetchPersonagensUnicos } from '@/lib/algolia';
import { getAllBlogPosts } from '@/lib/blog';
import { capitalize } from '@/lib/utils';

export const revalidate = 3600; // ISR — regenera a cada hora

const CATEGORIAS_DESTAQUE = [
  { slug: 'personagem_filme', nome: 'Personagens de Filme', icon: '🎬', cor: 'bg-coral-100' },
  { slug: 'personagem_anime', nome: 'Anime e Mangá', icon: '⚡', cor: 'bg-mustard-100' },
  { slug: 'animal', nome: 'Animais', icon: '🐾', cor: 'bg-sky-100' },
  { slug: 'tema_sazonal', nome: 'Datas Comemorativas', icon: '🎉', cor: 'bg-terracotta-100' },
  { slug: 'humano', nome: 'Profissões', icon: '👩‍⚕️', cor: 'bg-mustard-100' },
  { slug: 'educacional', nome: 'Educacional', icon: '📚', cor: 'bg-coral-100' },
];

export default async function HomePage() {
  // Em paralelo: personagens + posts recentes
  const [personagens, posts] = await Promise.all([
    fetchPersonagensUnicos(),
    Promise.resolve(getAllBlogPosts().slice(0, 3)),
  ]);

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
                Mais de 1.000 desenhos prontos
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

            {/* Atalhos populares */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-ink/50 font-medium">Populares:</span>
              {['stitch', 'homem-aranha', 'capivara', 'bobbie-goods', 'hello-kitty'].map((p) => (
                <Link
                  key={p}
                  href={`/buscar?q=${p}`}
                  className="px-3 py-1 bg-white border-2 border-ink/10 rounded-full font-medium hover:border-ink hover:bg-mustard-50 transition-all"
                >
                  {capitalize(p.replace('-', ' '))}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      {/* === OFERTA COMPACTA === */}
      <section className="container mx-auto px-4 mb-16">
        <OfertaCard variant="compact" />
      </section>

      {/* === CATEGORIAS === */}
      <section className="container mx-auto px-4 mb-16">
        <div className="mb-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Explorar por categoria
          </h2>
          <p className="text-ink/60 mt-1">Encontre rapidinho o que está procurando</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIAS_DESTAQUE.map((cat) => (
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
                  {post.cover && (
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      className="object-cover"
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
