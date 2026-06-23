'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

/**
 * Player de vídeo com "facade": carrega só a thumbnail.
 * O iframe pesado do YouTube só entra após o clique no play.
 * Protege LCP e tempo de carregamento (bom pra SEO).
 *
 * Aceita uma URL de embed do YouTube, ex:
 * https://www.youtube.com/embed/VIDEO_ID
 */
export function VideoEmbed({
  url,
  legenda,
  titulo = 'Vídeo',
}: {
  url: string;
  legenda?: string;
  titulo?: string;
}) {
  const [ativo, setAtivo] = useState(false);

  // Extrai o ID do vídeo pra montar a thumbnail
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([\w-]{11})/);
  const videoId = match?.[1];
  const thumb = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <figure className="my-8">
      <div className="relative aspect-video bg-ink/5 border-2 border-ink rounded-2xl overflow-hidden shadow-chunky-sm">
        {ativo ? (
          <iframe
            src={`${url}?autoplay=1`}
            title={titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAtivo(true)}
            className="group absolute inset-0 w-full h-full flex items-center justify-center"
            aria-label="Reproduzir vídeo"
            style={
              thumb
                ? {
                    backgroundImage: `url(${thumb})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          >
            <span className="flex items-center justify-center w-16 h-16 bg-terracotta text-cream rounded-full border-2 border-ink shadow-chunky group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 ml-1" fill="currentColor" />
            </span>
          </button>
        )}
      </div>
      {legenda && (
        <figcaption className="text-center text-sm text-ink/50 mt-2">
          {legenda}
        </figcaption>
      )}
    </figure>
  );
}
