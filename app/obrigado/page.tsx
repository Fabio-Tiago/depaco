import type { Metadata } from 'next';
import { PurchaseTracker } from '@/components/PurchaseTracker';

export const metadata: Metadata = {
  title: 'Compra confirmada — DEPACO',
  // Não indexar a página de obrigado
  robots: { index: false, follow: false },
};

// Server Component: lê a env var NO SERVIDOR. O link do WhatsApp é
// renderizado no HTML já pronto, mas a URL vem de uma variável que
// NÃO tem prefixo NEXT_PUBLIC_ — então ela nunca é embutida no bundle
// JavaScript do navegador. O usuário vê o link no botão (precisa clicar),
// mas o valor da env não fica exposto no código-fonte JS do site.
export default function ObrigadoPage() {
  // Sem NEXT_PUBLIC_ = só o servidor enxerga
  const whatsappUrl =
    process.env.WHATSAPP_URL ||
    'https://wa.me/5567984133360?text=Oi!%20Acabei%20de%20comprar%20e%20quero%20receber%20meus%20desenhos%20para%20colorir';

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <PurchaseTracker valorPadrao={0} />

      <div className="max-w-lg mx-auto">
        <div className="bg-white border-2 border-ink rounded-3xl shadow-chunky p-8 text-center">
          {/* Ícone */}
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-mustard border-2 border-ink rounded-full text-4xl">
            🎉
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">
            Compra confirmada!
          </h1>
          <p className="text-lg text-ink/70 mb-2 leading-relaxed">
            Que alegria ter você com a gente! Seu pagamento foi aprovado e seus
            desenhos já estão prontinhos.
          </p>

          {/* Destaque */}
          <div className="bg-mustard border-2 border-ink rounded-2xl px-4 py-4 my-6 font-display font-bold text-ink">
            📲 Seu PDF será enviado pelo WhatsApp!
          </div>

          {/* Passos */}
          <div className="bg-cream border-2 border-ink rounded-2xl p-5 text-left mb-6">
            <p className="font-display font-bold text-ink mb-3">Como receber seus desenhos:</p>
            <ol className="list-decimal list-inside space-y-2 text-ink/80">
              <li>Clique no botão verde abaixo para abrir o WhatsApp.</li>
              <li>Envie a mensagem que já vai preenchida.</li>
              <li>Pronto! Vamos te mandar o PDF completo pra imprimir e colorir. 🖍️</li>
            </ol>
          </div>

          {/* Botão WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white font-display text-lg font-bold px-6 py-4 border-2 border-ink rounded-2xl shadow-chunky hover:-translate-y-0.5 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Receber meus desenhos
          </a>

          <p className="text-sm text-ink/50 mt-5 leading-relaxed">
            Não recebeu ou ficou com dúvida? É só chamar no WhatsApp acima que a gente te
            ajuda rapidinho. 💛
          </p>
        </div>
      </div>
    </div>
  );
}
