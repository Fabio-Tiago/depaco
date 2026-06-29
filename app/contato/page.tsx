import type { Metadata } from 'next';
import { FormularioContato } from '@/components/FormularioContato';
import { FaleConosco } from '@/components/FaleConosco';

export const metadata: Metadata = {
  title: 'Fale Conosco | DEPACO — Desenhos para Colorir',
  description:
    'Entre em contato com o DEPACO. Tire dúvidas, envie sugestões ou fale com a gente pelo WhatsApp. Desenhos para colorir e imprimir para crianças.',
  alternates: { canonical: '/contato' },
};

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="max-w-2xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
            Fale com a gente 💬
          </h1>
          <p className="text-lg text-ink/70">
            Tem alguma dúvida, sugestão ou pedido especial de desenho? Escreva pra gente!
            Adoramos ouvir as famílias que usam o DEPACO.
          </p>
        </div>

        {/* Formulário */}
        <FormularioContato />

        {/* Separador */}
        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-0.5 bg-ink/10" />
          <span className="font-display font-bold text-ink/50">ou</span>
          <div className="flex-1 h-0.5 bg-ink/10" />
        </div>

        {/* Botão WhatsApp + redes (componente já existente) */}
        <FaleConosco />
      </div>
    </div>
  );
}
