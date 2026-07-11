'use client';

import { trackEvent } from '@/lib/fbpixel';
import { gaEvent } from '@/lib/ga';
import { comRastreioMeta } from '@/lib/metaTracking';
import type { PackOferta } from '@/types';

/**
 * Botão de checkout REUTILIZÁVEL.
 *
 * ── ONDE O InitiateCheckout É DISPARADO ──────────────────────────
 * NÃO é mais aqui. Com o Checkout Elements, clicar neste botão apenas
 * ROLA a página até o formulário — é um sinal fraco (qualquer visitante
 * clica e rola, sem intenção real de comprar). Otimizar campanha por
 * esse evento ensinaria o Meta a buscar gente que clica em botão.
 *
 * O InitiateCheckout agora dispara no CheckoutElements, quando o
 * formulário de pagamento ENTRA NA TELA — intenção bem mais concreta.
 *
 * Quando NÃO há checkout embutido (pack sem checkoutContentId), este
 * botão redireciona para a Eduzz — e aí sim ele dispara o evento, já
 * que sair do site É a ação relevante.
 * ─────────────────────────────────────────────────────────────────
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

    const alvo = document.getElementById('eduzz-checkout-elements');

    // ---- Caso A: checkout embutido na página ----
    if (pack.checkoutContentId && alvo) {
      // Só rola. O InitiateCheckout dispara quando o checkout aparecer
      // na tela (ver CheckoutElements.tsx).
      alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // ---- Caso B: redireciona para o checkout externo ----
    // Aqui o clique É a ação relevante, então marcamos o evento.
    trackEvent('InitiateCheckout', {
      value: pack.preco,
      currency: 'BRL',
      content_name: pack.nome ?? `Pack ${pack.id}`,
      content_ids: [pack.id],
      num_items: pack.total_desenhos ?? 1,
    });

    gaEvent('begin_checkout', {
      currency: 'BRL',
      value: pack.preco,
      items: [{ item_id: pack.id, item_name: pack.nome ?? `Pack ${pack.id}` }],
    });

    // Leva fbc/fbp na URL para a CAPI conseguir atribuir a venda
    const urlComRastreio = comRastreioMeta(pack.url_checkout);

    // Pequeno timeout dá tempo do evento sair antes de trocar de página
    setTimeout(() => {
      window.location.href = urlComRastreio;
    }, 150);
  }

  return (
    <a href={pack.url_checkout} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
