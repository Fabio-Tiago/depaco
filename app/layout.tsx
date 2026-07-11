import type { Metadata } from 'next';
import { Fredoka, Plus_Jakarta_Sans } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BotaoWhatsApp } from '@/components/BotaoWhatsApp';
import { MetaPixel } from '@/components/MetaPixel';
import { PixelPageView } from '@/components/PixelPageView';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { GAPageView } from '@/components/GAPageView';
import './globals.css';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://depaco.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DEPACO — Desenhos para Colorir e Imprimir Grátis',
    template: '%s | DEPACO',
  },
  description:
    'Mais de 1000 desenhos para colorir prontos para imprimir. Personagens, animais, profissões e temas educativos para crianças de 2 a 12 anos.',
  keywords: [
    'desenhos para colorir',
    'desenhos para imprimir',
    'colorir',
    'atividades infantis',
    'desenhos infantis',
    'imprimir desenhos',
    'pintar online',
  ],
  authors: [{ name: 'DEPACO' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'DEPACO',
    url: siteUrl,
    title: 'DEPACO — Desenhos para Colorir e Imprimir',
    description: 'Mais de 1000 desenhos para colorir prontos para imprimir.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEPACO — Desenhos para Colorir',
    description: 'Desenhos prontos para imprimir.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <MetaPixel />
        <PixelPageView />
        <GoogleAnalytics />
        <GAPageView />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Botão flutuante do WhatsApp — canto inferior direito.
            No mobile sobe um pouco para não ficar atrás da barra de oferta. */}
        <BotaoWhatsApp />
      </body>
    </html>
  );
}
