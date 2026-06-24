import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPostBySlug, getAllBlogSlugs, splitBlogContent } from '@/lib/blog';
import { fetchDesenhosCarrossel } from '@/lib/algolia';
import { OfertaCard } from '@/components/OfertaCard';
import { BlogCarrossel } from '@/components/BlogCarrossel';
import { BannerOfertaHorizontal } from '@/components/BannerOfertaHorizontal';
import { VideoEmbed } from '@/components/VideoEmbed';
import { FaleConosco } from '@/components/FaleConosco';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Post não encontrado' };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      images: post.cover ? [post.cover] : [],
    },
    alternates: { canonical: `/blog/${slug}` },
  };
}

const proseClasses =
  'prose prose-ink prose-lg max-w-none prose-headings:font-display prose-headings:text-ink prose-p:leading-relaxed prose-a:text-coral prose-a:no-underline hover:prose-a:underline';

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  // Divide o texto em 2 partes pelo marcador ---BLOCO---
  const partes = splitBlogContent(post.content);
  const parte1 = partes[0] || '';
  const parte2 = partes.slice(1).join('\n\n');

  // Carrossel: desenhos do personagem relacionado (server-side)
  const desenhosCarrossel = await fetchDesenhosCarrossel(post.related_personagem || '', 10);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'DEPACO' },
    image: post.cover || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container-narrow py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink/60 mb-6">
          <Link href="/" className="hover:text-coral">Início</Link> /{' '}
          <Link href="/blog" className="hover:text-coral">Blog</Link> /{' '}
          <span className="text-ink/40 truncate">{post.title}</span>
        </nav>

        {/* Data */}
        <p className="text-sm text-coral font-bold mb-2 uppercase">
          {new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {/* H1 */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight mb-4">
          {post.title}
        </h1>

        {/* Descrição / linha fina */}
        <p className="text-lg text-ink/70 mb-8">{post.description}</p>

        {/* PARTE 1 do texto */}
        {parte1 && (
          <div className={proseClasses}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{parte1}</ReactMarkdown>
          </div>
        )}

        {/* Carrossel de desenhos */}
        <BlogCarrossel desenhos={desenhosCarrossel} />

        {/* Banner compacto (Banner 2) */}
        <BannerOfertaHorizontal />

        {/* PARTE 2 do texto */}
        {parte2 && (
          <div className={`${proseClasses} mt-8`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{parte2}</ReactMarkdown>
          </div>
        )}

        {/* Vídeo (se houver) */}
        {post.video_url && (
          <VideoEmbed url={post.video_url} legenda={post.video_legenda} titulo={post.title} />
        )}

        {/* Banner grande no fim */}
        <div className="mt-12">
          <OfertaCard variant="compact" />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-mustard-100 border-2 border-ink/10 rounded-full text-xs font-bold">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Fale Conosco + redes sociais */}
        <FaleConosco />
      </article>
    </>
  );
}
