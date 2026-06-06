import Link from 'next/link';
import Image from 'next/image';
import logoHorizontal from '@/public/logo-horizontal.png';

/**
 * Logo DEPACO — imagem horizontal (mascote lápis + wordmark).
 * Tamanho responsivo via prop `size` ('sm' | 'md' | 'lg').
 * A proporção original da arte é ~1024x276 (≈ 3.7:1).
 */
export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const height = { sm: 32, md: 44, lg: 64 }[size];
  const width = Math.round(height * 3.7); // mantém a proporção da arte

  return (
    <Link
      href="/"
      className="inline-flex items-center hover:rotate-[-2deg] transition-transform"
      aria-label="DEPACO — Página inicial"
    >
      <Image
        src={logoHorizontal}
        alt="DEPACO — Desenhos para Colorir"
        height={height}
        width={width}
        priority
        className="h-auto w-auto"
        style={{ height, width: 'auto' }}
      />
    </Link>
  );
}
