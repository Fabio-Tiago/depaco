'use client';

/**
 * Helpers para disparar eventos do Meta Pixel de qualquer componente.
 *
 * Uso:
 *   import { trackEvent } from '@/lib/fbpixel';
 *   trackEvent('Lead');
 *   trackEvent('ViewContent', { content_name: 'Stitch', content_category: 'animes' });
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Eventos padrão do Meta (recomendados — o algoritmo entende e otimiza por eles)
type StandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact'
  | 'Download'
  | 'Subscribe';

export function trackEvent(event: StandardEvent, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  }
}

// Para eventos personalizados (não-padrão), use trackCustom
export function trackCustom(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', event, params);
  }
}
