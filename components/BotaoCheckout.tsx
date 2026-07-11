'use client';

import { trackEvent } from '@/lib/fbpixel';
import { gaEvent } from '@/lib/ga';
import { comRastreioMeta } from '@/lib/metaTracking';
import type { PackOferta } from '@/types';

/**
 * Botão de checkout REUTILIZÁVEL.
 * Dispara InitiateCheckout (Meta Pixel) + begin_checkout (GA4) no clique.
 *
 * Depois, faz UMA de duas coisas:
 *
 *  a) Se o pack tem `checkoutContentId` E existe um Checkout Elements na
 *     página → ROLA suavemente até ele. A pessoa não sai do site.
 *
 *  b) Caso contrário → redireciona para a URL de checkout da Eduzz,
 *     levando junto os identificadores de rastreio do Meta (fbc/fbp).
 *
 * Exemplo:
 *   <BotaoCheckout pack={pack} className="...">
 *     QUERO MEU PACK AGORA →
 *   </BotaoCheckout>
 */
export function BotaoCheckout({
  pack,
  className = '',
  children,
}: {
  pack: PackOferta;
  className?: string;
  children: React.ReactNode;
}) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    // ---- Meta Pixel: InitiateCheckout ----
    trackEvent('InitiateCheckout', {
      value: pack.preco,
      currency: 'BRL',
      content_name: pack.nome ?? `Pack ${pack.id}`,
      content_ids: [pack.id],
      num_items: pack.total_desenhos ?? 1,
    });

    // ---- GA4: begin_checkout ----
    gaEvent('begin_checkout', {
      currency: 'BRL',
      value: pack.preco,
      items: [{ item_id: pack.id, item_name: pack.nome ?? `Pack ${pack.id}` }],
    });

    // ---- Checkout embutido na própria página? ----
    const alvo = document.getElementById('eduzz-checkout-elements');

    if (pack.checkoutContentId && alvo) {
      // Rola até o formulário de pagamento. Sem sair do site.
      alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // ---- Fallback: redireciona para o checkout da Eduzz ----
    // Leva fbc/fbp na URL para a Conversions API conseguir atribuir a
    // venda ao anúncio que gerou o clique.
    const urlComRastreio = comRastreioMeta(pack.url_checkout);

    // Pequeno timeout dá tempo do evento sair antes de trocar de página.
    setTimeout(() => {
      window.location.href = urlComRastreio;
    }, 150);
  }

  // O href aponta para o checkout externo — serve como fallback caso o
  // JavaScript falhe, e mantém o link acessível (abrir em nova aba etc.)
  return (
    <a href={pack.url_checkout} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
