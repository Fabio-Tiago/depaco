'use client';

import Script from 'next/script';

/**
 * Google Analytics 4 (gtag.js).
 * Carrega em todas as páginas via layout raiz.
 *
 * "afterInteractive": carrega logo após a página ficar interativa,
 * sem prejudicar a performance (bom pro Core Web Vitals / SEO).
 *
 * O ID fica em variável de ambiente (NEXT_PUBLIC_GA_ID) para facilitar
 * troca/teste. Como o GA roda no navegador, o ID pode ser público.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-G5989T240Y';

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
