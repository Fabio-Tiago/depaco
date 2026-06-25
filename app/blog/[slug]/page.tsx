import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPostBySlug, getAllBlogSlugs, parseBlogSegments } from '@/lib/blog';
import { fetchDesenhosCarrossel } from '@/lib/algolia';
import { BlogCarrossel } from '@/components/BlogCarrossel';
import { BannerOfertaHorizontal } from '@/components/BannerOfertaHorizontal';
import { VideoEmbed } from '@/components/VideoEmbed';
import { OfertaCard } from '@/components/OfertaCard';
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
  'prose prose-ink prose-lg max-w-none ' +
  'prose-headings:font-display prose-headings:text-ink ' +
  'prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 ' +
  'prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 ' +
  'prose-p:leading-relaxed prose-p:my-5 ' +
  'prose-ul:my-5 prose-li:my-2 ' +
  'prose-a:text-coral prose-a:no-underline hover:prose-a:underline';

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const segmentos = parseBlogSegments(post.content);

  // Carrega o carrossel só se algum segmento for do tipo carrossel
  const precisaCarrossel = segmentos.some((s) => s.tipo === 'carrossel');
  const desenhosCarrossel = precisaCarrossel
    ? await fetchDesenhosCarrossel(post.related_personagem || '', 10)
    : [];

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

        {/* Descrição */}
        <p className="text-lg text-ink/70 mb-8">{post.description}</p>

        {/* Corpo: segmentos em ordem */}
        {segmentos.map((seg, i) => {
          if (seg.tipo === 'texto') {
            return (
              <div key={i} className={proseClasses}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{seg.conteudo}</ReactMarkdown>
              </div>
            );
          }
          if (seg.tipo === 'carrossel') {
            return <BlogCarrossel key={i} desenhos={desenhosCarrossel} />;
          }
          if (seg.tipo === 'video') {
            return post.video_url ? (
              <VideoEmbed key={i} url={post.video_url} legenda={post.video_legenda} titulo={post.title} />
            ) : null;
          }
          if (seg.tipo === 'banner') {
            return <BannerOfertaHorizontal key={i} />;
          }
          if (seg.tipo === 'oferta') {
            return (
              <div key={i} className="my-12">
                <OfertaCard variant="compact" />
              </div>
            );
          }
          return null;
        })}

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

        {/* Fale Conosco — sempre no fim */}
        <FaleConosco />
      </article>
    </>
  );
}
