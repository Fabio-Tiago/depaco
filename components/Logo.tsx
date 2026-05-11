import Link from 'next/link';

/**
 * Logo DEPACO em SVG inline.
 * Mascote de lápis amarelo + wordmark colorida em estilo chunky cartoon.
 * Tamanho responsivo via prop `size` ('sm' | 'md' | 'lg').
 */
export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = {
    sm: { w: 100, h: 32, mascotSize: 32 },
    md: { w: 140, h: 44, mascotSize: 44 },
    lg: { w: 200, h: 64, mascotSize: 64 },
  }[size];

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 hover:rotate-[-2deg] transition-transform"
      aria-label="DEPACO — Página inicial"
    >
      {/* Mascote: lápis sorridente */}
      <svg
        width={dims.mascotSize}
        height={dims.mascotSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Corpo do lápis amarelo */}
        <path
          d="M20 18 L44 18 L44 50 Q44 56 38 58 L26 58 Q20 56 20 50 Z"
          fill="#F4B936"
          stroke="#1F1F1F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Ponta */}
        <path
          d="M26 14 L38 14 L44 18 L20 18 Z"
          fill="#E04E32"
          stroke="#1F1F1F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Rosto - olhos */}
        <circle cx="28" cy="34" r="2.5" fill="#1F1F1F" />
        <circle cx="36" cy="34" r="2.5" fill="#1F1F1F" />
        {/* Brilho nos olhos */}
        <circle cx="28.8" cy="33.2" r="0.8" fill="#FDFBF7" />
        <circle cx="36.8" cy="33.2" r="0.8" fill="#FDFBF7" />
        {/* Bochecha */}
        <circle cx="24" cy="40" r="2" fill="#F87956" opacity="0.7" />
        <circle cx="40" cy="40" r="2" fill="#F87956" opacity="0.7" />
        {/* Boca sorriso */}
        <path
          d="M28 42 Q32 46 36 42"
          stroke="#1F1F1F"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Wordmark */}
      <span
        className="font-display font-bold tracking-tight leading-none flex"
        style={{ fontSize: size === 'sm' ? 18 : size === 'md' ? 24 : 32 }}
      >
        <span className="text-coral">D</span>
        <span className="text-mustard">E</span>
        <span className="text-terracotta">P</span>
        <span className="text-sky">A</span>
        <span className="text-coral">C</span>
        <span className="text-mustard">O</span>
      </span>
    </Link>
  );
}
