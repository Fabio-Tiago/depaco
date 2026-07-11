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

/**
 * Dispara um evento padrão do Meta Pixel.
 *
 * O 3º parâmetro (eventID) é usado para DEDUPLICAÇÃO: quando o mesmo
 * evento também é enviado pelo servidor (Conversions API), os dois
 * precisam carregar o MESMO eventID — senão o Meta conta a conversão
 * duas vezes.
 *
 * Ex: trackEvent('Purchase', { value: 12.9, currency: 'BRL' }, 'purchase_12345')
 */
export function trackEvent(
  event: StandardEvent,
  params?: Record<string, unknown>,
  eventID?: string
) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (eventID) {
      window.fbq('track', event, params, { eventID });
    } else {
      window.fbq('track', event, params);
    }
  }
}

// Para eventos personalizados (não-padrão), use trackCustom
export function trackCustom(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', event, params);
  }
}
