import type { MetadataRoute } from 'next';
import { fetchAllDesenhoIds, fetchPersonagensUnicos, fetchCategoriasDisponiveis } from '@/lib/algolia';
import { getAllBlogSlugs } from '@/lib/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://depaco.com.br';

/**
 * Sitemap dinâmico gerado a partir do Algolia.
 * Inclui todas as páginas indexáveis: home, desenhos, personagens, categorias, blog.
 * Vercel respeita até 50k URLs por sitemap automaticamente.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/buscar`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/pack/mega-pack-300`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];

  // Tudo dinâmico em paralelo (inclui categorias reais do Algolia)
  const [desenhoIds, personagens, blogSlugs, categoriasSlugs] = await Promise.all([
    fetchAllDesenhoIds(),
    fetchPersonagensUnicos(),
    Promise.resolve(getAllBlogSlugs()),
    fetchCategoriasDisponiveis(),
  ]);

  const categorias = categoriasSlugs.map((c) => ({
    url: `${SITE_URL}/categorias/${c}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const desenhoUrls = desenhoIds.map((id) => ({
    url: `${SITE_URL}/desenhos/${id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const personagemUrls = personagens.map((p) => ({
    url: `${SITE_URL}/personagem/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const blogUrls = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categorias, ...desenhoUrls, ...personagemUrls, ...blogUrls];
}
