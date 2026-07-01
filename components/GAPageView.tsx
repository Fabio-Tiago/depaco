'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_ID } from './GoogleAnalytics';

/**
 * No App Router a navegação é client-side (SPA) e não recarrega a página.
 * Como desativamos o send_page_view automático no config do GA, este
 * componente dispara um page_view a CADA mudança de rota — assim o GA4
 * registra corretamente todas as páginas vistas, sem duplicar a primeira.
 */
function GAPageViewInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    window.gtag('event', 'page_view', {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function GAPageView() {
  return (
    <Suspense fallback={null}>
      <GAPageViewInner />
    </Suspense>
  );
}
