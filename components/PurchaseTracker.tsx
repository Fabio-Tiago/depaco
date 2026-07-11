'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/fbpixel';
import { gaEvent } from '@/lib/ga';

/**
 * Dispara o evento de compra no Meta Pixel e no GA4 quando a página
 * de obrigado carrega. Esta página só é acessada após a compra ser
 * aprovada, então o carregamento = conversão.
 *
 * ── DEDUPLICAÇÃO COM A CONVERSIONS API ───────────────────────────
 * A mesma venda chega ao Meta por DOIS caminhos:
 *   1. daqui (Pixel do navegador)
 *   2. do servidor (n8n -> Conversions API, via webhook da Eduzz)
 *
 * Para o Meta não contar a venda 2x, os dois precisam mandar o MESMO
 * event_id. O n8n usa `purchase_{id_da_fatura}` — então aqui usamos
 * exatamente o mesmo formato, lendo o ID da querystring.
 *
 * Se o ID não vier na URL, NÃO disparamos o Purchase do navegador:
 * é melhor confiar só na CAPI (mais confiável) do que arriscar uma
 * conversão duplicada inflando os relatórios.
 * ─────────────────────────────────────────────────────────────────
 */
export function PurchaseTracker({ valorPadrao = 0 }: { valorPadrao?: number }) {
  useEffect(() => {
    let valor = valorPadrao;
    let pedidoId: string | null = null;

    try {
      const params = new URLSearchParams(window.location.search);

      // ---- VALOR ----
      const v = params.get('valor') || params.get('value') || params.get('price');
      if (v && !Number.isNaN(Number(v))) valor = Number(v);

      // ---- ID DO PEDIDO ----
      // Precisa ser o MESMO id que a Eduzz manda no webhook (data.id).
      pedidoId =
        params.get('invoice_id') ||
        params.get('trans_cod') ||
        params.get('transaction_id') ||
        params.get('order_id') ||
        params.get('pedido') ||
        params.get('id') ||
        null;
    } catch {
      // querystring inválida — segue com os padrões
    }

    // ---- GA4: sempre dispara (não sofre com duplicação) ----
    gaEvent('purchase', {
      currency: 'BRL',
      value: valor,
      transaction_id: pedidoId || 'eduzz-' + Date.now(),
    });

    // ---- Meta Pixel ----
    if (pedidoId) {
      // Tem o ID -> dispara com eventID; o Meta deduplica com a CAPI
      trackEvent(
        'Purchase',
        { value: valor, currency: 'BRL' },
        `purchase_${pedidoId}` // MESMO formato usado no n8n
      );
    } else {
      // Sem ID -> não dispara. A CAPI já registra a venda no servidor,
      // e disparar aqui sem eventID faria o Meta contar 2x.
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[PurchaseTracker] ID do pedido ausente na URL — Purchase do navegador ' +
            'NÃO disparado (a CAPI registra a venda). Configure a Eduzz para ' +
            'repassar o id na URL de retorno.'
        );
      }
    }
  }, [valorPadrao]);

  return null;
}
