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
 * Para o Meta não contar 2x, os dois mandam o MESMO event_id.
 *
 * ⚠️ ATENÇÃO AO ID CERTO:
 * A Eduzz devolve DOIS identificadores diferentes:
 *   - `transaction_id` (ex: 323223870)  <- ESTE, na URL de obrigado
 *   - id da fatura (data.id no webhook) <- OUTRO número!
 *
 * O n8n foi configurado para usar `data.transaction.id`, que é o mesmo
 * número do `transaction_id` da URL. Os dois lados batem.
 *
 * Parâmetros reais que a Eduzz manda na URL de retorno:
 *   transaction_id, valor, moeda, fbp, email_comprador, nome_comprador
 * ─────────────────────────────────────────────────────────────────
 */
export function PurchaseTracker({ valorPadrao = 0 }: { valorPadrao?: number }) {
  useEffect(() => {
    let valor = valorPadrao;
    let moeda = 'BRL';
    let transactionId: string | null = null;

    try {
      const params = new URLSearchParams(window.location.search);

      // ---- VALOR (a Eduzz manda como "valor") ----
      const v = params.get('valor') || params.get('valor_moeda') || params.get('value');
      if (v && !Number.isNaN(Number(v))) valor = Number(v);

      // ---- MOEDA ----
      moeda = params.get('moeda') || 'BRL';

      // ---- ID DA TRANSAÇÃO (o que casa com o n8n) ----
      transactionId =
        params.get('transaction_id') ||   // nome real da Eduzz
        params.get('transactionkey') ||   // fallback
        params.get('chave') ||
        null;
    } catch {
      // querystring inválida — segue com os padrões
    }

    // ---- GA4: sempre dispara (não sofre com duplicação) ----
    gaEvent('purchase', {
      currency: moeda,
      value: valor,
      transaction_id: transactionId || 'eduzz-' + Date.now(),
    });

    // ---- Meta Pixel ----
    if (transactionId) {
      // Mesmo event_id que o n8n usa -> o Meta deduplica
      trackEvent(
        'Purchase',
        { value: valor, currency: moeda },
        `purchase_${transactionId}`
      );
    } else {
      // Sem o id não dá para deduplicar. A CAPI (servidor) já registra
      // a venda, então é mais seguro NÃO disparar aqui do que arriscar
      // contar a conversão duas vezes.
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[PurchaseTracker] transaction_id ausente na URL — Purchase do ' +
            'navegador NÃO disparado (a CAPI registra a venda).'
        );
      }
    }
  }, [valorPadrao]);

  return null;
}
