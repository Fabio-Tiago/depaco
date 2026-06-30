'use client';

import Script from 'next/script';

/**
 * Meta Pixel (Facebook/Instagram Ads).
 * Carrega em todas as páginas via layout raiz.
 *
 * Estratégia "afterInteractive": o Next carrega o Pixel logo após a
 * página ficar interativa — rastreia tudo sem travar o carregamento.
 *
 * O ID fica em variável de ambiente (NEXT_PUBLIC_FB_PIXEL_ID) para
 * não ficar fixo no código e facilitar trocar/testar.
 */

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '4335505859994640';

export function MetaPixel() {
  if (!FB_PIXEL_ID) return null;

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
