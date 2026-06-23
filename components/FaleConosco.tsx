'use client';

import { MessageCircle, Instagram, Youtube } from 'lucide-react';

export function FaleConosco() {
  const whats = process.env.NEXT_PUBLIC_WHATSAPP_URL || '#';
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';
  const youtube = process.env.NEXT_PUBLIC_YOUTUBE_URL || '#';

  return (
    <div className="my-12">
      
        href={whats}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-4 w-full max-w-2xl mx-auto px-8 py-6 bg-[#25D366] text-ink rounded-3xl font-display text-3xl md:text-4xl font-bold border-2 border-ink shadow-chunky-lg transition-all"
      >
        <span className="flex items-center justify-center w-14 h-14 bg-white rounded-full border-2 border-ink">
          <MessageCircle className="w-8 h-8" />
        </span>
        Fale Conosco
      </a>
      <div className="mt-10 text-center">
        <p className="font-display font-bold text-ink mb-3">Siga-nos:</p>
        <div className="flex items-center justify-center gap-4">
          <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 flex items-center justify-center bg-white border-2 border-ink rounded-full shadow-chunky-sm transition-transform">
            <Instagram className="w-6 h-6 text-ink" />
          </a>
          <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-12 h-12 flex items-center justify-center bg-white border-2 border-ink rounded-full shadow-chunky-sm transition-transform">
            <Youtube className="w-6 h-6 text-ink" />
          </a>
        </div>
      </div>
    </div>
  );
}
