import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPostBySlug, getAllBlogSlugs } from '@/lib/blog';
import { OfertaCard } from '@/components/OfertaCard';

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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

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
        <nav className="text-sm text-ink/60 mb-6">
          <Link href="/" className="hover:text-coral">Início</Link> /{' '}
          <Link href="/blog" className="hover:text-coral">Blog</Link> /{' '}
          <span className="text-ink/40 truncate">{post.title}</span>
        </nav>

        <p className="text-sm text-coral font-bold mb-2 uppercase">
          {new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-lg text-ink/70 mb-8">{post.description}</p>

        {post.cover && (
          <div className="aspect-video relative bg-mustard-100 border-2 border-ink rounded-2xl overflow-hidden shadow-chunky-lg mb-10">
            <Image src={post.cover} alt={post.title} fill className="object-cover" priority sizes="100vw" />
          </div>
        )}

        <div className="prose prose-ink prose-lg max-w-none prose-headings:font-display prose-headings:text-ink prose-a:text-coral prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {/* CTA oferta no fim do post */}
        <div className="mt-12">
          <OfertaCard variant="compact" />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-mustard-100 border-2 border-ink/10 rounded-full text-xs font-bold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </>
  );
}
