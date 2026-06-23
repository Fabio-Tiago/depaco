import { MessageCircle, Instagram, Youtube } from 'lucide-react';

/**
 * Bloco de fechamento do post: botão grande de WhatsApp + redes sociais.
 * Número e links vêm de env vars (NEXT_PUBLIC_*).
 */
export function FaleConosco() {
  const whats = process.env.NEXT_PUBLIC_WHATSAPP_URL || '#';
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';
  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_URL || '#';
  const youtube = process.env.NEXT_PUBLIC_YOUTUBE_URL || '#';

  return (
    <div className="my-12">
      {/* Botão grande WhatsApp */}
      
        href={whats}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-4 w-full max-w-2xl mx-auto px-8 py-6 bg-[#25D366] text-ink rounded-3xl font-display text-3xl md:text-4xl font-bold border-2 border-ink shadow-chunky-lg hover:translate-y-[-3px] hover:shadow-chunky transition-all"
      >
        <span className="flex items-center justify-center w-14 h-14 bg-white rounded-full border-2 border-ink">
          <MessageCircle className="w-8 h-8 text-[#25D366]" fill="currentColor" />
        </span>
        Fale Conosco
      </a>

      {/* Siga-nos */}
      <div className="mt-10 text-center">
        <p className="font-display font-bold text-ink mb-3">Siga-nos:</p>
        <div className="flex items-center justify-center gap-4">
          <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-ink rounded-full shadow-chunky-sm hover:-translate-y-1 transition-transform">
            <Instagram className="w-6 h-6 text-ink" />
          </a>
          <a href={tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-ink rounded-full shadow-chunky-sm hover:-translate-y-1 transition-transform">
            {/* lucide não tem ícone TikTok; uso um SVG simples */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-ink"><path d="M16.5 5.5a4.5 4.5 0 0 0 3.5 1.7V10a7.7 7.7 0 0 1-3.5-.9v5.4a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v2.9a2.6 2.6 0 1 0 1.8 2.5V2h2.8a4.5 4.5 0 0 0 .5 3.5z"/></svg>
          </a>
          <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-ink rounded-full shadow-chunky-sm hover:-translate-y-1 transition-transform">
            <Youtube className="w-6 h-6 text-ink" />
          </a>
        </div>
      </div>
    </div>
  );
}
