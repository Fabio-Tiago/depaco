'use client';

/**
 * Captura os identificadores de rastreio do Meta (fbc e fbp) que ficam
 * guardados como cookies no navegador.
 *
 * ── POR QUE ISSO IMPORTA ─────────────────────────────────────────
 * O webhook da Eduzz sai do SERVIDOR dela, que não tem acesso aos
 * cookies do navegador do comprador. Sem fbc/fbp, a Conversions API
 * consegue registrar a venda, mas o Meta tem dificuldade de ligá-la
 * ao clique no anúncio que a originou.
 *
 * Segundo o próprio Gerenciador de Eventos:
 *   • fbc (click id)   -> +53% em conversões atribuídas
 *   • fbp (browser id) -> +19%
 *
 * A solução é ler os cookies aqui (no navegador) e repassá-los para a
 * Eduzz na URL do checkout. Ela devolve no webhook, e o n8n envia ao
 * Meta pela CAPI.
 * ─────────────────────────────────────────────────────────────────
 */

function lerCookie(nome: string): string | null {
  if (typeof document === 'undefined') return null;
  const achado = document.cookie
    .split('; ')
    .find((linha) => linha.startsWith(nome + '='));
  return achado ? decodeURIComponent(achado.split('=').slice(1).join('=')) : null;
}

/**
 * _fbc — identifica o CLIQUE no anúncio.
 * O Pixel cria esse cookie quando a pessoa chega com ?fbclid=... na URL.
 *
 * Se o cookie ainda não existir (ex.: a pessoa acabou de chegar e o Pixel
 * não gravou), montamos o valor a partir do fbclid da própria URL, no
 * formato que o Meta espera: fb.1.{timestamp}.{fbclid}
 */
export function getFbc(): string | null {
  const cookie = lerCookie('_fbc');
  if (cookie) return cookie;

  // Fallback: monta a partir do fbclid da URL
  try {
    const fbclid = new URLSearchParams(window.location.search).get('fbclid');
    if (fbclid) {
      return `fb.1.${Date.now()}.${fbclid}`;
    }
  } catch {
    // ignora
  }

  return null;
}

/** _fbp — identifica o NAVEGADOR. O Pixel cria em toda visita. */
export function getFbp(): string | null {
  return lerCookie('_fbp');
}

/**
 * Anexa fbc/fbp a uma URL de checkout, para que a Eduzz os devolva
 * no webhook e a CAPI possa enviá-los ao Meta.
 *
 * A Eduzz repassa parâmetros desconhecidos adiante, então mandamos
 * tanto com nome direto (fbc/fbp) quanto em campos utm, aumentando a
 * chance de pelo menos um sobreviver ao caminho.
 */
export function comRastreioMeta(urlCheckout: string): string {
  try {
    const url = new URL(urlCheckout);

    const fbc = getFbc();
    const fbp = getFbp();

    if (fbc) {
      url.searchParams.set('fbc', fbc);
      url.searchParams.set('utm_fbc', fbc);
    }
    if (fbp) {
      url.searchParams.set('fbp', fbp);
      url.searchParams.set('utm_fbp', fbp);
    }

    return url.toString();
  } catch {
    // URL inválida — devolve a original sem quebrar o fluxo
    return urlCheckout;
  }
}
