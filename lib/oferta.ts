import type { PackOferta } from '@/types';

/**
 * Configuração do pack principal de venda.
 * Edite aqui quando trocar de plataforma de pagamento.
 */
export const PACK_PRINCIPAL: PackOferta = {
  id: 'mega-pack-300',
  nome: 'Mega Pack DEPACO',
  descricao: '300 desenhos únicos para colorir — variedade de personagens, animais e temas',
  total_desenhos: Number(process.env.NEXT_PUBLIC_PACK_QUANTITY) || 300,
  preco: Number(process.env.NEXT_PUBLIC_PACK_PRICE) || 19.9,
  preco_de: 39.9,
  url_checkout: process.env.NEXT_PUBLIC_PACK_CHECKOUT_URL || '#',
  preview_urls: [], // será preenchido com URLs reais quando você tiver as imagens da preview
};

/**
 * Formata preço em BRL.
 */
export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Calcula desconto percentual.
 */
export function calcDesconto(precoDe: number, preco: number): number {
  return Math.round((1 - preco / precoDe) * 100);
}
