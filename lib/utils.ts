/**
 * Concatena classes condicionalmente (alternativa leve ao `clsx`).
 */
export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Slugify simples para gerar URLs amigáveis.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Capitaliza primeira letra de cada palavra.
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Resolve o texto alt de uma imagem de desenho para SEO (Google Imagens).
 * Prioridade: alt_pt pré-montado (n8n) → fórmula com personagem/pose/cenário.
 * A fórmula inclui "para colorir" porque é a intenção de busca real.
 */
export function resolverAltDesenho(d: {
  alt_pt?: string;
  personagem?: string;
  pose?: string;
  cenario?: string;
}): string {
  if (d.alt_pt && d.alt_pt.trim()) return d.alt_pt.trim();

  const nome = d.personagem ? capitalize(d.personagem.replace(/-/g, ' ')) : 'Desenho';
  const partes = [`Desenho de ${nome} para colorir`];
  if (d.pose) partes.push(d.pose);
  if (d.cenario && !/sem cen[áa]rio|fundo branco/i.test(d.cenario)) {
    partes.push(d.cenario);
  }
  return partes.join(', ');
}
