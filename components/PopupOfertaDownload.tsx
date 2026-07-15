'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { X, Download, Sparkles, Check } from 'lucide-react';

/**
 * PopupOfertaDownload
 *
 * Intercepta o clique de "Baixar desenho". Antes de liberar o download,
 * oferece o Mega Pack. É um "content upgrade": a pessoa já mostrou
 * intenção (quer o desenho), então esse é o melhor momento para ofertar.
 *
 * Fluxo:
 *   clica "Baixar"  → abre o popup
 *   "Quero o Pack"  → vai pro checkout (com rastreio Meta)
 *   "Só o desenho"  → fecha o popup e faz o download direto
 *
 * A oferta NÃO trava o desenho grátis. Quem recusa baixa normalmente —
 * isso mantém a promessa da campanha e evita frustração/reembolso.
 */

interface PopupOfertaDownloadProps {
  /** URL do arquivo do desenho para baixar */
  urlDownload: string;
  /** Nome do arquivo (ex: "ursinho.pdf") */
  nomeArquivo: string;
  /** Nome do personagem, para personalizar a headline */
  personagem?: string;
  /** Dados do pack ofertado */
  pack: {
    id: string;
    nome: string;
    total_desenhos: number;
    preco: number;
    preco_de?: number;
    url_checkout: string;
    /** O que o pack contém, no plural. Ex: "desenhos", "atividades",
     *  "materiais". Deixa a oferta certa pra cada tipo de pack. */
    tipo_item?: string;
  };
  /** Classe do botão de download (para casar com o design da página) */
  className?: string;
  /** Texto do botão */
  children?: React.ReactNode;
}

// Paleta DEPACO
const CORES = {
  mostarda: '#F4B936',
  coral: '#F87956',
  terracota: '#E04E32',
  ink: '#1F1F1F',
  cream: '#FDFBF7',
  sky: '#7AC4D6',
};

function formatBRL(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function PopupOfertaDownload({
  urlDownload,
  nomeArquivo,
  personagem,
  pack,
  className = '',
  children,
}: PopupOfertaDownloadProps) {
  const [aberto, setAberto] = useState(false);
  const [baixando, setBaixando] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fecharRef = useRef<HTMLButtonElement>(null);

  const desconto =
    pack.preco_de && pack.preco_de > pack.preco
      ? Math.round(((pack.preco_de - pack.preco) / pack.preco_de) * 100)
      : 0;

  // O que o pack contém, no plural. Cai em "desenhos" se não vier nada,
  // para o pack de desenhos continuar funcionando sem mudar nada.
  const itemPlural = pack.tipo_item || 'desenhos';

  // ---- Dispara o download de fato ----
  const baixarDesenho = useCallback(async () => {
    setBaixando(true);

    try {
      // Baixa via blob: força o SALVAMENTO do arquivo em vez de abrir
      // a imagem numa aba. Necessário porque a imagem vem do Supabase
      // (domínio diferente), e nesse caso o atributo `download` do <a>
      // é ignorado pelo navegador — ele só abriria a imagem.
      const resposta = await fetch(urlDownload);
      const blob = await resposta.blob();
      const urlBlob = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // libera a memória do blob
      URL.revokeObjectURL(urlBlob);
    } catch {
      // Se o fetch falhar (ex: CORS), cai no método simples como último recurso
      const a = document.createElement('a');
      a.href = urlDownload;
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // evento de download (GA / Meta, se existirem)
    if (typeof window !== 'undefined') {
      const w = window as unknown as {
        gtag?: (...args: unknown[]) => void;
        fbq?: (...args: unknown[]) => void;
      };
      w.gtag?.('event', 'download_desenho', {
        desenho: nomeArquivo,
        personagem,
      });
      // não disparamos "Purchase" aqui — download não é venda
    }

    setTimeout(() => {
      setBaixando(false);
      setAberto(false);
    }, 600);
  }, [urlDownload, nomeArquivo, personagem]);

  // ---- Abre o popup em vez de baixar direto ----
  const aoClicarBaixar = useCallback(() => {
    setAberto(true);

    // evento: a oferta foi vista (útil para medir conversão do popup)
    if (typeof window !== 'undefined') {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.('event', 'oferta_pack_vista', {
        origem: 'popup_download',
        personagem,
      });
    }
  }, [personagem]);

  // ---- Vai pro checkout do pack ----
  const irParaPack = useCallback(() => {
    if (typeof window !== 'undefined') {
      const w = window as unknown as {
        gtag?: (...args: unknown[]) => void;
        fbq?: (...args: unknown[]) => void;
      };
      w.gtag?.('event', 'oferta_pack_aceita', {
        origem: 'popup_download',
        pack: pack.id,
      });
      // sinaliza intenção de compra para o Meta
      w.fbq?.('track', 'InitiateCheckout', {
        content_ids: [pack.id],
        content_type: 'product',
        value: pack.preco,
        currency: 'BRL',
      });
    }
  }, [pack.id, pack.preco]);

  // ---- Acessibilidade: ESC fecha, foco entra no popup ----
  useEffect(() => {
    if (!aberto) return;

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false);
    };
    document.addEventListener('keydown', aoTeclar);

    // trava o scroll do fundo
    document.body.style.overflow = 'hidden';

    // foca o botão de fechar (bom para leitor de tela)
    fecharRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [aberto]);

  return (
    <>
      {/* Botão que a página mostra */}
      <button
        type="button"
        onClick={aoClicarBaixar}
        className={className}
      >
        {children || (
          <>
            <Download className="w-5 h-5" aria-hidden="true" />
            Baixar desenho
          </>
        )}
      </button>

      {/* Popup */}
      {aberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-oferta"
        >
          {/* Fundo escuro */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setAberto(false)}
            aria-hidden="true"
          />

          {/* Cartão da oferta */}
          <div
            ref={dialogRef}
            className="relative w-full max-w-md rounded-3xl border-[3px] shadow-2xl animate-[popIn_0.25s_ease-out]"
            style={{
              backgroundColor: CORES.cream,
              borderColor: CORES.ink,
            }}
          >
            {/* Fechar */}
            <button
              ref={fecharRef}
              type="button"
              onClick={() => setAberto(false)}
              className="absolute right-4 top-4 z-10 rounded-full p-1.5 transition hover:scale-110"
              style={{ backgroundColor: CORES.ink, color: CORES.cream }}
              aria-label="Fechar oferta"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="p-7 pt-9">
              {/* Selo */}
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                style={{ backgroundColor: CORES.mostarda, color: CORES.ink }}
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Oferta especial
              </div>

              {/* Headline — vende o fim da dor, não o produto */}
              <h2
                id="titulo-oferta"
                className="mt-4 text-2xl font-extrabold leading-tight"
                style={{ color: CORES.ink }}
              >
                Cansada de baixar um por vez?
              </h2>

              <p className="mt-2 text-base" style={{ color: CORES.ink }}>
                Leve <strong>{pack.total_desenhos} {itemPlural}</strong> de uma
                vez e nunca mais perca tempo procurando e baixando um por um.
              </p>

              {/* Benefícios */}
              <ul className="mt-5 space-y-2">
                {[
                  `${pack.total_desenhos} ${itemPlural} prontos para imprimir`,
                  'Baixa tudo de uma vez, num único arquivo',
                  'Organizados por tema, fáceis de achar',
                  'Acesso imediato após o pagamento',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: CORES.ink }}
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: CORES.sky }}
                    >
                      <Check className="w-3 h-3" style={{ color: CORES.ink }} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Preço */}
              <div
                className="mt-6 flex items-end justify-center gap-2 rounded-2xl border-2 py-4"
                style={{ borderColor: CORES.ink, backgroundColor: '#FFFFFF' }}
              >
                {pack.preco_de && (
                  <span
                    className="mb-1 text-sm line-through opacity-50"
                    style={{ color: CORES.ink }}
                  >
                    {formatBRL(pack.preco_de)}
                  </span>
                )}
                <span className="text-4xl font-extrabold" style={{ color: CORES.terracota }}>
                  {formatBRL(pack.preco)}
                </span>
                {desconto > 0 && (
                  <span
                    className="mb-1.5 rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{ backgroundColor: CORES.coral, color: CORES.cream }}
                  >
                    -{desconto}%
                  </span>
                )}
              </div>

              {/* CTA principal — aceita a oferta */}
              <Link
                href={`/pack/${pack.id}#checkout`}
                onClick={irParaPack}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] py-4 text-base font-extrabold transition hover:translate-y-[-2px] hover:shadow-lg"
                style={{
                  backgroundColor: CORES.coral,
                  borderColor: CORES.ink,
                  color: CORES.cream,
                }}
              >
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                Quero o Mega Pack
              </Link>

              {/* Recusa — baixa só o desenho, sem travar nada */}
              <button
                type="button"
                onClick={baixarDesenho}
                disabled={baixando}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition hover:opacity-70 disabled:opacity-40"
                style={{ color: CORES.ink }}
              >
                {baixando ? (
                  'Baixando...'
                ) : (
                  <>
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Não, quero só este desenho
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* animação de entrada */}
      <style jsx>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
