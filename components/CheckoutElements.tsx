'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Checkout Elements da Eduzz — renderiza o checkout DENTRO do site,
 * sem redirecionar para o domínio da Eduzz.
 *
 * ── POR QUE VALE A PENA ──────────────────────────────────────────
 * 1. Menos abandono: a pessoa não é jogada para um domínio estranho
 * 2. Tracking melhor: o Pixel continua rodando na mesma página, então
 *    os cookies _fbc/_fbp ficam acessíveis o tempo todo (é o que faltava
 *    para subir a pontuação de correspondência do Meta)
 * 3. Sem cookies de terceiros: tudo roda em depaco.com.br
 * ─────────────────────────────────────────────────────────────────
 *
 * O script da Eduzz é injetado uma única vez. Um guard global evita
 * inicializar duas vezes se o React remontar o componente.
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

export function CheckoutElements({ contentId }: { contentId: string }) {
  const jaIniciou = useRef(false);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (jaIniciou.current) return;

    let cancelado = false;

    function inicializar() {
      if (cancelado || jaIniciou.current) return;

      if (!window.Eduzz?.Checkout?.init) {
        // Script carregou mas a API ainda não está pronta — tenta de novo
        return;
      }

      try {
        window.Eduzz.Checkout.init({
          contentId,
          target: TARGET_ID,
          errorCover: false,
        });
        jaIniciou.current = true;
      } catch {
        setErro(true);
      }
    }

    // O script já está na página? (ex.: navegação client-side)
    const existente = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );

    if (existente && window.Eduzz?.Checkout) {
      inicializar();
      return;
    }

    // Injeta o script se ainda não existir
    if (!existente) {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.type = 'module';
      script.onerror = () => setErro(true);
      document.body.appendChild(script);
    }

    // A API do Eduzz aparece um instante depois do script carregar.
    // Fazemos polling curto até ela existir (máx. ~10s).
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

  if (erro) {
    return (
      <div className="bg-cream border-2 border-ink rounded-3xl p-8 text-center">
        <p className="text-ink/70 mb-4">
          Não foi possível carregar o checkout aqui. Sem problema — dá para
          finalizar a compra normalmente na página segura da Eduzz.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-terracotta text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky hover:-translate-y-0.5 transition-all"
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  return (
    <div
      id={TARGET_ID}
      className="min-h-[500px] rounded-3xl overflow-hidden"
      aria-label="Formulário de pagamento"
    />
  );
}
