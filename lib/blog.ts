import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost } from '@/types';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

/**
 * Lê todos os posts do diretório content/blog/.
 * Cada post é um .md com frontmatter.
 */
export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'Equipe DEPACO',
      tags: data.tags || [],
      cover: data.cover || '',
      related_personagem: data.related_personagem || '',
      video_url: data.video_url || '',
      video_legenda: data.video_legenda || '',
      faq: Array.isArray(data.faq) ? data.faq : [],
      content,
    } as BlogPost;
  });

  // Ordena por data desc
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    author: data.author || 'Equipe DEPACO',
    tags: data.tags || [],
    cover: data.cover || '',
    related_personagem: data.related_personagem || '',
    video_url: data.video_url || '',
    video_legenda: data.video_legenda || '',
    faq: Array.isArray(data.faq) ? data.faq : [],
    content,
  };
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

/**
 * Divide o conteúdo do post em partes usando o marcador ---BLOCO---.
 * Retorna sempre um array; se não houver marcador, devolve [conteúdo].
 */
/** Tipos de bloco que podem aparecer no corpo do post. */
export type BlogSegmento =
  | { tipo: 'texto'; conteudo: string }
  | { tipo: 'carrossel' }
  | { tipo: 'video' }
  | { tipo: 'banner' }
  | { tipo: 'oferta' };

/**
 * Quebra o conteúdo do post em segmentos, detectando marcadores
 * [[CARROSSEL]], [[VIDEO]], [[BANNER]], [[OFERTA]] em linha própria.
 * Tudo entre marcadores vira um segmento de texto (markdown).
 */
export function parseBlogSegments(content: string): BlogSegmento[] {
  const linhas = content.split('\n');
  const segmentos: BlogSegmento[] = [];
  let buffer: string[] = [];

  const flushTexto = () => {
    const txt = buffer.join('\n').trim();
    if (txt) segmentos.push({ tipo: 'texto', conteudo: txt });
    buffer = [];
  };

  const marcadores: Record<string, BlogSegmento['tipo']> = {
    '[[CARROSSEL]]': 'carrossel',
    '[[VIDEO]]': 'video',
    '[[BANNER]]': 'banner',
    '[[OFERTA]]': 'oferta',
  };

  for (const linha of linhas) {
    const chave = linha.trim().toUpperCase();
    if (marcadores[chave]) {
      flushTexto();
      segmentos.push({ tipo: marcadores[chave] } as BlogSegmento);
    } else {
      buffer.push(linha);
    }
  }
  flushTexto();

  return segmentos;
}
