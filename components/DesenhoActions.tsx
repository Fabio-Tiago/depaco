'use client';

import { DownloadCloud, Printer } from 'lucide-react';
import { downloadImage } from '@/lib/supabase';

/**
 * Botões de ação na página do desenho: Baixar e Imprimir.
 * Componente client porque precisa de window.print() e fetch para download.
 */
export function DesenhoActions({
  imageUrl,
  filename,
}: {
  imageUrl: string;
  filename: string;
}) {
  const handleDownload = () => {
    downloadImage(imageUrl, filename);
  };

  const handlePrint = () => {
    // Abre janela de impressão direto com a imagem
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Imprimir desenho</title>
          <style>
            @page { size: A4; margin: 1cm; }
            body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            img { max-width: 100%; max-height: 100vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" onload="window.print(); setTimeout(() => window.close(), 500);" />
        </body>
      </html>
    `);
    w.document.close();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleDownload}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-mustard text-ink rounded-2xl font-bold border-2 border-ink shadow-chunky hover:translate-y-[-2px] hover:shadow-chunky-lg transition-all"
      >
        <DownloadCloud className="w-5 h-5" />
        Baixar PNG
      </button>

      <button
        onClick={handlePrint}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-cream text-ink rounded-2xl font-bold border-2 border-ink shadow-chunky-sm hover:translate-y-[-2px] hover:shadow-chunky transition-all"
      >
        <Printer className="w-5 h-5" />
        Imprimir agora
      </button>
    </div>
  );
}
