'use client';

/**
 * Helper para disparar eventos do Google Analytics 4 de qualquer componente.
 *
 * Uso:
 *   import { gaEvent } from '@/lib/ga';
 *   gaEvent('download_desenho', { personagem: 'Stitch', categoria: 'animes' });
 *   gaEvent('search', { search_term: 'dinossauro' });
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function gaEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params || {});
  }
}
