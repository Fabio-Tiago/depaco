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
  personagem: { nome: 'Personagens Fofos', icon: '🧸', cor: 'bg-coral-100' },
  animal: { nome: 'Animais', icon: '🐾', cor: 'bg-sky-100' },
  tema_sazonal: { nome: 'Datas Comemorativas', icon: '🎉', cor: 'bg-terracotta-100' },
  objeto: { nome: 'Objetos', icon: '🧩', cor: 'bg-mustard-100' },
  natureza: { nome: 'Natureza', icon: '🌿', cor: 'bg-sky-100' },
  educacional: { nome: 'Educacional', icon: '📚', cor: 'bg-coral-100' },
  humano: { nome: 'Profissões', icon: '👩‍⚕️', cor: 'bg-mustard-100' },
  'copa-do-mundo': { nome: 'Futebol e Copa', icon: '⚽', cor: 'bg-sky-100' },
};

// Visual padrão para categorias ainda sem metadados definidos.
const CORES_PADRAO = ['bg-mustard-100', 'bg-coral-100', 'bg-sky-100', 'bg-terracotta-100'];

/**
 * Detecção de ícone por palavra-chave no slug. Cobre categorias NOVAS
 * automaticamente, sem precisar editar o mapa explícito acima.
 * Ex: "copa-do-mundo" contém "copa"/"futebol" -> ⚽.
 * A ordem importa: a primeira palavra-chave encontrada vence.
 */
const ICONES_POR_PALAVRA: Array<[RegExp, string]> = [
  [/futebol|copa|mundial|gol|esporte|bola/i, '⚽'],
  [/natal|papai.?noel|presente/i, '🎄'],
  [/pascoa|coelho|ovo/i, '🐰'],
  [/halloween|abobora|bruxa|terror/i, '🎃'],
  [/junina|festa.?junina|sao.?joao/i, '🌽'],
  [/carnaval|fantasia/i, '🎭'],
  [/aniversario|festa|comemora/i, '🎉'],
  [/anime|manga|mangá/i, '⚡'],
  [/filme|cinema|heroi|herói/i, '🎬'],
  [/animal|bicho|mamifero|mamífero|ave|peixe/i, '🐾'],
  [/natureza|planta|arvore|árvore|flor|floresta/i, '🌿'],
  [/bandeira|pais|país|mundo/i, '🏳️'],
  [/escola|educa|letra|numero|número|alfabeto/i, '📚'],
  [/profiss|trabalho|humano|pessoa/i, '👩‍⚕️'],
  [/carro|veiculo|veículo|transporte|aviao|avião/i, '🚗'],
  [/comida|fruta|doce|alimento/i, '🍎'],
  [/princesa|castelo|conto|fada/i, '👑'],
  [/dinossauro|dino/i, '🦖'],
  [/espaco|espaço|planeta|foguete|astronauta/i, '🚀'],
  [/objeto|coisa/i, '🧩'],
];

function detectarIcone(slug: string): string | null {
  const texto = slug.replace(/[-_]/g, ' ');
  for (const [regex, icone] of ICONES_POR_PALAVRA) {
    if (regex.test(texto)) return icone;
  }
  return null;
}

/**
 * Retorna os metadados de uma categoria, em 3 camadas de prioridade:
 *   1. mapa explícito CATEGORIA_META (controle fino, quando definido)
 *   2. detecção de ícone por palavra-chave no slug (cobre categorias novas)
 *   3. visual padrão (ícone 🎨, cor estável) — nunca quebra
 */
export function getCategoriaMeta(slug: string): CategoriaMeta {
  // cor determinística: mesma categoria sempre recebe a mesma cor
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash + slug.charCodeAt(i)) % CORES_PADRAO.length;
  const corPadrao = CORES_PADRAO[hash];

  // Camada 1: mapa explícito
  const meta = CATEGORIA_META[slug];
  if (meta) return { slug, ...meta };

  // Camada 2: detecção por palavra-chave
  const iconeDetectado = detectarIcone(slug);

  // Camada 3: padrão
  return {
    slug,
    nome: formatarNome(slug),
    icon: iconeDetectado || '🎨',
    cor: corPadrao,
  };
}

/** Nome bonito de uma categoria (atalho). */
export function getCategoriaNome(slug: string): string {
  return getCategoriaMeta(slug).nome;
}
