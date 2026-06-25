import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { resolverCapaPost } from '@/lib/algolia';
import { OfertaCard } from '@/components/OfertaCard';

export const metadata: Metadata = {
  title: 'Blog — Dicas e ideias para colorir',
  description: 'Conteúdos sobre desenhos para colorir, dicas de pintura para crianças e ideias criativas.',
  alternates: { canonical: '/blog' },
};

// ISR — regenera a cada hora para refletir capas do acervo (Algolia)
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = getAllBlogPosts();

  // Resolve a capa de cada post (acervo via related_personagem, ou fallback)
  const postsComCapa = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      capa: await resolverCapaPost({
        cover: post.cover,
        related_personagem: post.related_personagem,
      }),
    }))
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
        Blog DEPACO
      </h1>
      <p className="text-ink/70 mb-10 max-w-2xl">
        Dicas, ideias e curiosidades sobre desenhos para colorir, atividades infantis e diversão garantida.
      </p>

      {postsComCapa.length === 0 ? (
        <div className="bg-white border-2 border-ink rounded-2xl p-12 text-center shadow-chunky-sm">
          <p className="text-ink/60 mb-2">📝 Em breve, novos posts!</p>
          <p className="text-sm text-ink/40">
            Estamos preparando conteúdos especiais para você.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {postsComCapa.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white border-2 border-ink rounded-2xl overflow-hidden shadow-chunky-sm hover:shadow-chunky hover:-translate-y-1 transition-all"
            >
              {post.capa ? (
                <div className="aspect-video relative bg-mustard-100">
                  <Image
                    src={post.capa}
                    alt={post.title}
                    fill
                    className="object-contain p-3"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-mustard-100 to-coral-100 flex items-center justify-center text-5xl">
                  ✨
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-coral font-bold mb-2 uppercase">
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </p>
                <h2 className="font-display text-xl font-bold text-ink leading-tight mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-ink/60 line-clamp-3">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <OfertaCard variant="compact" />
    </div>
  );
}
