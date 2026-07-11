import type { PackOferta, AlgoliaDesenhoRecord } from '@/types';

/**
 * Catálogo de packs. Para adicionar um novo pack temático, basta
 * adicionar um objeto aqui (e as env vars correspondentes). Nenhum
 * componente precisa ser alterado.
 *
 * Regra de exibição: o desenho é comparado contra `keywords` de cada
 * pack temático. O primeiro que casar é mostrado. Se nenhum casar,
 * mostra o pack marcado com isDefault.
 */

// === PACK GERAL (default) ===
export const PACK_GERAL: PackOferta = {
  id: 'mega-pack-desenhos-para-colorir',
  nome: 'Mega Pack DEPACO',
  descricao: '1600+ desenhos únicos para colorir — variedade de personagens, animais e temas',
  total_desenhos: Number(process.env.NEXT_PUBLIC_PACK_QUANTITY) || 1600,
  preco: Number(process.env.NEXT_PUBLIC_PACK_PRICE) || 19.9,
  preco_de: 39.9,
  url_checkout: process.env.NEXT_PUBLIC_PACK_CHECKOUT_URL || '#',
  // ID do Checkout Elements (Eduzz). Se definido, o checkout aparece
  // embutido na página do pack, sem redirecionar para fora do site.
  checkoutContentId: process.env.NEXT_PUBLIC_PACK_CONTENT_ID,
  preview_urls: [],
  isDefault: true,
};

// === PACK ESPORTE / COPA / FUTEBOL / OLIMPÍADAS ===
export const PACK_ESPORTE: PackOferta = {
  id: 'pack-esporte',
  nome: 'Pack Esporte DEPACO',
  descricao: 'Desenhos de futebol, Copa e Olimpíadas para colorir',
  total_desenhos: Number(process.env.NEXT_PUBLIC_PACK_ESPORTE_QUANTITY) || 100,
  preco: Number(process.env.NEXT_PUBLIC_PACK_ESPORTE_PRICE) || 14.9,
  preco_de: 29.9,
  url_checkout: process.env.NEXT_PUBLIC_PACK_ESPORTE_CHECKOUT_URL || '#',
  checkoutContentId: process.env.NEXT_PUBLIC_PACK_ESPORTE_CONTENT_ID,
  preview_urls: [],
  keywords: [
    'copa', 'futebol', 'olimpiada', 'olimpiadas', 'esporte', 'esportes',
    'bola', 'gol', 'time', 'selecao', 'craque', 'medalha', 'campeonato',
  ],
};

/** Todos os packs. A ordem define a prioridade dos temáticos. */
export const PACKS: PackOferta[] = [PACK_ESPORTE, PACK_GERAL];

/** Pack geral (fallback). */
export const PACK_PADRAO = PACKS.find((p) => p.isDefault) || PACK_GERAL;

/** Mantido por compatibilidade com imports antigos. */
export const PACK_PRINCIPAL = PACK_PADRAO;

/** Acha pack por id (usado na página /pack/[id]). */
export function getPackById(id: string): PackOferta | undefined {
  return PACKS.find((p) => p.id === id);
}

/**
 * Decide qual pack mostrar para um desenho, comparando os campos
 * textuais do desenho contra as keywords de cada pack temático.
 */
export function resolvePack(
  desenho?: Partial<AlgoliaDesenhoRecord> | null
): PackOferta {
  if (!desenho) return PACK_PADRAO;

  const haystack = normaliza(
    [
      desenho.personagem,
      desenho.subject_slug,
      desenho.pose,
      desenho.cenario,
      desenho.cenario_grupo,
      desenho.composicao,
    ]
      .filter(Boolean)
      .join(' ')
  );

  for (const pack of PACKS) {
    if (pack.isDefault || !pack.keywords?.length) continue;
    const casou = pack.keywords.some((kw) => haystack.includes(normaliza(kw)));
    if (casou) return pack;
  }

  return PACK_PADRAO;
}

/** Remove acentos e baixa caixa, pra matching robusto. */
function normaliza(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Formata preço em BRL. */
export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Calcula desconto percentual. */
export function calcDesconto(precoDe: number, preco: number): number {
  return Math.round((1 - preco / precoDe) * 100);
}
