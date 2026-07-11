'use client';

import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/fbpixel';
import { gaEvent } from '@/lib/ga';
import type { PackOferta } from '@/types';

/**
 * Checkout Elements da Eduzz — renderiza o checkout DENTRO do site,
 * sem redirecionar para o domínio da Eduzz.
 *
 * ── SOBRE OS EVENTOS DO META ─────────────────────────────────────
 * InitiateCheckout: disparado AQUI, quando o checkout entra na tela.
 *   Antes ficava no clique do botão — mas com o Elements o botão só
 *   rola a página, o que é um sinal fraco (qualquer um clica e rola).
 *   Ver o formulário de pagamento é uma intenção bem mais real.
 *
 * AddPaymentInfo: NÃO implementamos aqui. A própria Eduzz dispara esse
 *   evento quando o cliente interage com as opções de pagamento, e
 *   ainda manda os dados com hash SHA256 (advanced matching).
 *   Duplicar criaria evento repetido.
 *   ⚠️ Requisito: o Pixel precisa estar configurado no produto (MyEduzz).
 *
 * Purchase: vem da Conversions API (n8n + webhook) e do PurchaseTracker
 *   na /obrigado, deduplicados pelo mesmo event_id (transaction.key).
 * ─────────────────────────────────────────────────────────────────
 */

declare global {
  interface Window {
    Eduzz?: {
      Checkout: {
        init: (config: {
          contentId: string;
          target: string;
          errorCover?: boolean;
        }) => void;
      };
    };
  }
}

const SCRIPT_SRC = 'https://cdn.eduzzcdn.com/sun/bridge/bridge.js';
const TARGET_ID = 'eduzz-checkout-elements';

export function CheckoutElements({ pack }: { pack: PackOferta }) {
  const jaIniciou = useRef(false);
  const jaTrackeou = useRef(false);
  const container = useRef<HTMLDivElement>(null);
  const [erro, setErro] = useState(false);

  const contentId = pack.checkoutContentId;

  // ---------------------------------------------------------------
  // Carrega e inicializa o checkout da Eduzz
  // ---------------------------------------------------------------
  useEffect(() => {
    if (!contentId || jaIniciou.current) return;

    let cancelado = false;

    function inicializar() {
      if (cancelado || jaIniciou.current) return;
      if (!window.Eduzz?.Checkout?.init) return;

      try {
        window.Eduzz.Checkout.init({
          contentId: contentId as string,
          target: TARGET_ID,
          errorCover: false,
        });
        jaIniciou.current = true;
      } catch {
        setErro(true);
      }
    }

    const existente = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );

    if (existente && window.Eduzz?.Checkout) {
      inicializar();
      return;
    }

    if (!existente) {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.type = 'module';
      script.onerror = () => setErro(true);
      document.body.appendChild(script);
    }

    // A API do Eduzz só aparece um instante depois do script carregar
    let tentativas = 0;
    const timer = setInterval(() => {
      tentativas++;
      if (window.Eduzz?.Checkout?.init) {
        inicializar();
        clearInterval(timer);
      } else if (tentativas > 50) {
        clearInterval(timer);
        setErro(true);
      }
    }, 200);

    return () => {
      cancelado = true;
      clearInterval(timer);
    };
  }, [contentId]);

  // ---------------------------------------------------------------
  // InitiateCheckout — dispara quando o checkout ENTRA NA TELA
  //
  // Sinal muito mais honesto que o clique no botão: significa que a
  // pessoa chegou de fato ao formulário de pagamento.
  // Dispara só UMA vez por sessão.
  // ---------------------------------------------------------------
  useEffect(() => {
    const alvo = container.current;
    if (!alvo || jaTrackeou.current) return;

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting && !jaTrackeou.current) {
            jaTrackeou.current = true;

            trackEvent('InitiateCheckout', {
              value: pack.preco,
              currency: 'BRL',
              content_name: pack.nome ?? `Pack ${pack.id}`,
              content_ids: [pack.id],
              num_items: 1,
            });

            gaEvent('begin_checkout', {
              currency: 'BRL',
              value: pack.preco,
              items: [
                { item_id: pack.id, item_name: pack.nome ?? `Pack ${pack.id}` },
              ],
            });

            observer.disconnect();
          }
        }
      },
      // Exige 40% do bloco visível — evita disparar quando a pessoa
      // só passa raspando pela seção ao rolar rápido.
      { threshold: 0.4 }
    );

    observer.observe(alvo);
    return () => observer.disconnect();
  }, [pack]);

  if (!contentId) return null;

  if (erro) {
    return (
      <div className="bg-cream border-2 border-ink rounded-3xl p-8 text-center">
        <p className="text-ink/70 mb-4">
          Não foi possível carregar o checkout aqui. Sem problema — dá para
          finalizar a compra na página segura da Eduzz.
        </p>
        <a
          href={pack.url_checkout}
          className="inline-block px-6 py-3 bg-terracotta text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky hover:-translate-y-0.5 transition-all"
        >
          IR PARA O CHECKOUT →
        </a>
      </div>
    );
  }

  return (
    <div ref={container}>
      <div
        id={TARGET_ID}
        className="min-h-[500px] rounded-3xl overflow-hidden"
        aria-label="Formulário de pagamento"
      />
    </div>
  );
}
