'use client';

import { useState, useCallback, useEffect } from 'react';
import { Share2, Check, Copy, X } from 'lucide-react';

/**
 * BotaoCompartilhar
 *
 * Compartilhamento orgânico = distribuição grátis. Cada pessoa que manda
 * o desenho no grupo da escola traz visitantes sem custo de ads.
 *
 * Estratégia em duas camadas:
 *
 *   1. MENU NATIVO (navigator.share) — no celular abre o menu do sistema
 *      com TODAS as redes: WhatsApp, Instagram, TikTok, Stories, Telegram.
 *      É a única forma de compartilhar no Insta/TikTok pela web.
 *      É também a maioria do tráfego (mãe no celular).
 *
 *   2. FALLBACK com botões diretos — no desktop (onde o menu nativo é
 *      irregular), mostra WhatsApp, Facebook, Telegram e "copiar link".
 *
 * Instagram/TikTok/Stories NÃO têm URL de compartilhamento web — só
 * funcionam pelo menu nativo. Por isso a camada 1 é a principal.
 */

interface BotaoCompartilharProps {
  /** URL da página do desenho (o que será compartilhado) */
  url: string;
  /** Nome do personagem, para o texto da mensagem */
  personagem?: string;
  /** URL da imagem, para tentar compartilhar o arquivo direto (celular) */
  urlImagem?: string;
  /** Classe do botão, para casar com o design da página */
  className?: string;
}

const CORES = {
  mostarda: '#F4B936',
  coral: '#F87956',
  terracota: '#E04E32',
  ink: '#1F1F1F',
  cream: '#FDFBF7',
  sky: '#7AC4D6',
  whatsapp: '#25D366',
  telegram: '#0088CC',
  facebook: '#1877F2',
};

export default function BotaoCompartilhar({
  url,
  personagem,
  urlImagem,
  className = '',
}: BotaoCompartilharProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [temShareNativo, setTemShareNativo] = useState(false);

  // Detecta se o navegador tem o menu de compartilhar nativo
  useEffect(() => {
    setTemShareNativo(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function'
    );
  }, []);

  const nome = personagem || 'este desenho';
  const mensagem = `Achei ${nome} para colorir grátis! 🎨`;
  const textoCompleto = `${mensagem}\n${url}`;

  // ---- Evento de compartilhamento (para medir tração) ----
  const registrarShare = useCallback((rede: string) => {
    if (typeof window !== 'undefined') {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.('event', 'compartilhar_desenho', {
        rede,
        personagem,
      });
    }
  }, [personagem]);

  // ---- Menu nativo (celular) — pega Insta/TikTok/Stories ----
  const compartilharNativo = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.share) {
      setMenuAberto(true); // sem nativo → abre o menu de fallback
      return;
    }

    try {
      // Tenta compartilhar a IMAGEM junto (funciona em muitos celulares)
      if (urlImagem && navigator.canShare) {
        try {
          const resp = await fetch(urlImagem);
          const blob = await resp.blob();
          const arquivo = new File([blob], 'desenho.png', { type: blob.type });

          if (navigator.canShare({ files: [arquivo] })) {
            await navigator.share({
              title: `${nome} para colorir`,
              text: mensagem,
              url,
              files: [arquivo],
            });
            registrarShare('nativo_com_imagem');
            return;
          }
        } catch {
          // se falhar o arquivo, cai pro compartilhamento só de link
        }
      }

      // Compartilha só o link + texto
      await navigator.share({
        title: `${nome} para colorir`,
        text: mensagem,
        url,
      });
      registrarShare('nativo');
    } catch (err) {
      // usuário cancelou, ou deu erro → não faz nada
      if ((err as Error)?.name !== 'AbortError') {
        setMenuAberto(true);
      }
    }
  }, [url, urlImagem, nome, mensagem, registrarShare]);

  // ---- Copiar link ----
  const copiarLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      registrarShare('copiar_link');
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // navegador antigo — seleciona o texto num campo temporário
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  }, [url, registrarShare]);

  // ---- Links diretos (fallback desktop) ----
  const redesDiretas = [
    {
      nome: 'WhatsApp',
      cor: CORES.whatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(textoCompleto)}`,
      icone: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      nome: 'Facebook',
      cor: CORES.facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icone: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      nome: 'Telegram',
      cor: CORES.telegram,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(mensagem)}`,
      icone: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Botão principal */}
      <button
        type="button"
        onClick={temShareNativo ? compartilharNativo : () => setMenuAberto(true)}
        className={className}
        aria-label="Compartilhar este desenho"
      >
        <Share2 className="w-5 h-5" aria-hidden="true" />
        Compartilhar
      </button>

      {/* Menu de fallback (desktop, ou celular sem share nativo) */}
      {menuAberto && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Compartilhar"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuAberto(false)}
            aria-hidden="true"
          />

          <div
            className="relative w-full max-w-sm rounded-3xl border-[3px] p-6 shadow-2xl"
            style={{ backgroundColor: CORES.cream, borderColor: CORES.ink }}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold" style={{ color: CORES.ink }}>
                Compartilhar desenho
              </h3>
              <button
                type="button"
                onClick={() => setMenuAberto(false)}
                className="rounded-full p-1.5"
                style={{ backgroundColor: CORES.ink, color: CORES.cream }}
                aria-label="Fechar"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Redes diretas */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {redesDiretas.map((rede) => (
                <a
                  key={rede.nome}
                  href={rede.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    registrarShare(rede.nome.toLowerCase());
                    setMenuAberto(false);
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl border-2 p-3
                             transition hover:-translate-y-1"
                  style={{ borderColor: CORES.ink, backgroundColor: '#FFFFFF' }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: rede.cor }}
                  >
                    {rede.icone}
                  </span>
                  <span className="text-xs font-bold" style={{ color: CORES.ink }}>
                    {rede.nome}
                  </span>
                </a>
              ))}
            </div>

            {/* Instagram/TikTok: só pelo app */}
            <p
              className="mb-4 rounded-xl px-3 py-2 text-center text-xs"
              style={{ backgroundColor: CORES.mostarda, color: CORES.ink }}
            >
              💡 Para Instagram, TikTok ou Stories, salve a imagem e
              publique pelo app.
            </p>

            {/* Copiar link */}
            <button
              type="button"
              onClick={copiarLink}
              className="flex w-full items-center justify-center gap-2 rounded-2xl
                         border-2 py-3 font-bold transition hover:opacity-80"
              style={{
                borderColor: CORES.ink,
                backgroundColor: copiado ? CORES.sky : '#FFFFFF',
                color: CORES.ink,
              }}
            >
              {copiado ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Link copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  Copiar link
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
