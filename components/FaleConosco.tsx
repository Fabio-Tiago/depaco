import { Instagram, Youtube } from 'lucide-react';

export function FaleConosco() {
  const whats = process.env.NEXT_PUBLIC_WHATSAPP_URL || '#';
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';
  const youtube = process.env.NEXT_PUBLIC_YOUTUBE_URL || '#';
  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_URL || '#';

  return (
    <div className="my-12">
      <a href={whats} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 w-full max-w-2xl mx-auto px-8 py-6 bg-green-500 text-ink rounded-3xl font-display text-3xl md:text-4xl font-bold border-2 border-ink shadow-chunky-lg transition-all">
        <span className="flex items-center justify-center w-14 h-14 bg-white rounded-full border-2 border-ink">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-ink" aria-hidden="true">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.747-.967.232.16zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/>
          </svg>
        </span>
        Fale Conosco
      </a>
      <div className="mt-10 text-center">
        <p className="font-display font-bold text-ink mb-3">Siga-nos:</p>
        <div className="flex items-center justify-center gap-4">
          <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 flex items-center justify-center bg-white border-2 border-ink rounded-full shadow-chunky-sm"><Instagram className="w-6 h-6 text-ink" /></a>
          <a href={tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-12 h-12 flex items-center justify-center bg-white border-2 border-ink rounded-full shadow-chunky-sm">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-ink" aria-hidden="true">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>
          <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-12 h-12 flex items-center justify-center bg-white border-2 border-ink rounded-full shadow-chunky-sm"><Youtube className="w-6 h-6 text-ink" /></a>
        </div>
      </div>
    </div>
  );
}
