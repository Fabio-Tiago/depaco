'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * No App Router, a navegação entre páginas é client-side (SPA) e NÃO
 * recarrega a página — então o PageView do Pixel só dispararia uma vez.
 * Este componente escuta mudanças de rota e dispara um PageView a cada
 * navegação, pra você medir todas as páginas vistas corretamente.
 */
function PixelPageViewInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
    // dispara a cada mudança de caminho ou query
  }, [pathname, searchParams]);

  return null;
}

export function PixelPageView() {
  // Suspense necessário porque useSearchParams suspende no App Router
  return (
    <Suspense fallback={null}>
      <PixelPageViewInner />
    </Suspense>
  );
}
