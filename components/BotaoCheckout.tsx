'use client';

import { trackEvent } from '@/lib/fbpixel';
import { gaEvent } from '@/lib/ga';
import type { PackOferta } from '@/types';

/**
 * Botão de checkout REUTILIZÁVEL.
 * Dispara InitiateCheckout (Meta Pixel) + begin_checkout (GA4) no clique,
 * e então redireciona para a URL de checkout do pack (Eduzz).
 *
 * Use no lugar de qualquer <Link href={pack.url_checkout}>. Serve para
 * TODOS os packs atuais e futuros — basta passar o `pack`.
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

    // Meta Pixel — InitiateCheckout
    trackEvent('InitiateCheckout', {
      value: pack.preco,
      currency: 'BRL',
      content_name: pack.nome ?? `Pack ${pack.id}`,
      content_ids: [pack.id],
      num_items: pack.total_desenhos ?? 1,
    });

    // GA4 — begin_checkout
    gaEvent('begin_checkout', {
      currency: 'BRL',
      value: pack.preco,
      items: [{ item_id: pack.id, item_name: pack.nome ?? `Pack ${pack.id}` }],
    });

    // Redireciona pro checkout (Eduzz).
    // Pequeno timeout dá tempo do evento sair antes de trocar de página.
    setTimeout(() => {
      window.location.href = pack.url_checkout;
    }, 150);
  }

  return (
    <a href={pack.url_checkout} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
