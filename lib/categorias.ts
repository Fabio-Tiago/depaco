import { formatarNome } from '@/lib/utils';

export interface CategoriaMeta {
  slug: string;
  nome: string;
  icon: string;
  cor: string;
}

/**
 * Metadados visuais por categoria. É a ÚNICA fonte de nome bonito/ícone/cor.
 * Categorias novas (vindas do Algolia) que não estiverem aqui ganham um
 * visual padrão automático — então o site nunca quebra ao surgir uma nova.
 * Para dar um visual caprichado a uma categoria nova, basta adicioná-la aqui.
 */
const CATEGORIA_META: Record<string, Omit<CategoriaMeta, 'slug'>> = {
  personagem_filme: { nome: 'Personagens de Filme', icon: '🎬', cor: 'bg-coral-100' },
  personagem_anime: { nome: 'Anime e Mangá', icon: '⚡', cor: 'bg-mustard-100' },
  animal: { nome: 'Animais', icon: '🐾', cor: 'bg-sky-100' },
  tema_sazonal: { nome: 'Datas Comemorativas', icon: '🎉', cor: 'bg-terracotta-100' },
  objeto: { nome: 'Objetos', icon: '🧩', cor: 'bg-mustard-100' },
  natureza: { nome: 'Natureza', icon: '🌿', cor: 'bg-sky-100' },
  educacional: { nome: 'Educacional', icon: '📚', cor: 'bg-coral-100' },
  humano: { nome: 'Profissões', icon: '👩‍⚕️', cor: 'bg-mustard-100' },
};

// Visual padrão para categorias ainda sem metadados definidos.
const CORES_PADRAO = ['bg-mustard-100', 'bg-coral-100', 'bg-sky-100', 'bg-terracotta-100'];

/**
 * Retorna os metadados de uma categoria. Se não houver entrada no mapa,
 * gera um visual padrão (nome formatado a partir do slug, ícone genérico,
 * cor rotacionada de forma estável).
 */
export function getCategoriaMeta(slug: string): CategoriaMeta {
  const meta = CATEGORIA_META[slug];
  if (meta) return { slug, ...meta };

  // fallback determinístico: mesma categoria sempre recebe a mesma cor
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash + slug.charCodeAt(i)) % CORES_PADRAO.length;
  return {
    slug,
    nome: formatarNome(slug),
    icon: '🎨',
    cor: CORES_PADRAO[hash],
  };
}

/** Nome bonito de uma categoria (atalho). */
export function getCategoriaNome(slug: string): string {
  return getCategoriaMeta(slug).nome;
}
