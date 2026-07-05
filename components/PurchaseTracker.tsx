'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/fbpixel';
import { gaEvent } from '@/lib/ga';

/**
 * Dispara o evento de compra no Meta Pixel e no GA4 quando a página
 * de obrigado carrega. Esta página só é acessada após a compra ser
 * aprovada, então o carregamento = conversão.
 *
 * value/currency podem vir da querystring se a Eduzz repassar (?valor=9.90),
 * senão usa o padrão informado nas props.
 */
export function PurchaseTracker({ valorPadrao = 0 }: { valorPadrao?: number }) {
  useEffect(() => {
    // tenta ler valor real da URL (?valor=), senão usa o padrão
    let valor = valorPadrao;
    try {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('valor') || params.get('value');
      if (v && !Number.isNaN(Number(v))) valor = Number(v);
    } catch {
      // ignora
    }

    // Meta Pixel
    trackEvent('Purchase', { value: valor, currency: 'BRL' });

    // GA4
    gaEvent('purchase', {
      currency: 'BRL',
      value: valor,
      transaction_id: 'eduzz-' + Date.now(),
    });
  }, [valorPadrao]);

  return null;
}
