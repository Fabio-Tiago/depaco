import type { Metadata } from 'next';
import Link from 'next/link';
import { FaleConosco } from '@/components/FaleConosco';

export const metadata: Metadata = {
  title: 'Sobre o DEPACO | Desenhos para Colorir feitos com carinho',
  description:
    'Conheça a história do DEPACO, um projeto criado por um pai para levar desenhos para colorir e imprimir a crianças de todo o Brasil. Saiba quem somos e o que nos move.',
  alternates: { canonical: '/sobre' },
};

export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="max-w-3xl mx-auto">
        {/* HERO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-mustard-100 border-2 border-ink rounded-full mb-6 shadow-chunky-sm">
            <span className="font-display font-bold text-ink text-sm">Nossa história ✨</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            Sobre o DEPACO
          </h1>
          <p className="text-lg md:text-xl text-ink/70">
            Desenhos para colorir feitos com carinho, para a criançada brasileira soltar a
            imaginação — em casa, na escola ou na casa da vovó.
          </p>
        </div>

        {/* O QUE É O DEPACO */}
        <section className="bg-white border-2 border-ink rounded-3xl shadow-chunky p-6 md:p-8 mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
            O que é o DEPACO
          </h2>
          <div className="space-y-4 text-ink/80 text-lg leading-relaxed">
            <p>
              O DEPACO nasceu de uma ideia simples: facilitar a vida de mães, pais e avós que
              querem ver as crianças longe das telas e perto de um lápis de cor. Aqui você
              encontra desenhos para colorir e imprimir sobre tudo o que a garotada ama —
              animais, personagens, números, letras, datas comemorativas e muito mais.
            </p>
            <p>
              Cada desenho é pensado para ser fácil de imprimir em casa e divertido de pintar.
              São traços limpos e contornos bem marcados, do jeitinho que funciona para as
              mãozinhas pequenas que ainda estão aprendendo a colorir dentro das linhas — e
              também para os maiores, que já capricham nos detalhes.
            </p>
            <p>
              Acreditamos que colorir é mais do que um passatempo. É um momento de calma, de
              concentração e de criatividade. É a avó e o neto na mesa da cozinha, é a tarde de
              chuva que vira diversão, é o orgulho de mostrar o desenho pronto na geladeira.
            </p>
          </div>
        </section>

        {/* QUEM CRIOU */}
        <section className="bg-cream border-2 border-ink rounded-3xl shadow-chunky p-6 md:p-8 mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
            Quem está por trás 👋
          </h2>
          <div className="space-y-4 text-ink/80 text-lg leading-relaxed">
            <p>
              O DEPACO foi idealizado e construído por{' '}
              <span className="font-bold text-ink">Fabio Tiago</span>, pai de um casal e
              apaixonado por pintura. Foi justamente esse gosto por colorir, somado à vontade
              de oferecer algo bom para os próprios filhos, que deu origem ao projeto.
            </p>
            <p>
              No mercado, Fabio atua como estrategista de marketing digital e de automações.
              É ele quem idealiza e desenvolve o DEPACO e toda a tecnologia por trás dele — do
              site à forma como os desenhos são organizados e disponibilizados. O DEPACO é,
              acima de tudo, um projeto feito por um pai, com o cuidado de quem entende
              tanto de tecnologia quanto da alegria de ver um filho pintando.
            </p>
          </div>
        </section>

        {/* PARA QUEM */}
        <section className="bg-white border-2 border-ink rounded-3xl shadow-chunky p-6 md:p-8 mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-6">
            Para quem é o DEPACO
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-mustard-100 border-2 border-ink rounded-2xl shadow-chunky-sm">
              <div className="text-3xl mb-2">👩‍👧</div>
              <p className="font-display font-bold text-ink">Mães e pais</p>
              <p className="text-sm text-ink/70 mt-1">
                que querem atividades saudáveis e criativas para os filhos
              </p>
            </div>
            <div className="text-center p-4 bg-coral-100 border-2 border-ink rounded-2xl shadow-chunky-sm">
              <div className="text-3xl mb-2">👵</div>
              <p className="font-display font-bold text-ink">Vovós e vovôs</p>
              <p className="text-sm text-ink/70 mt-1">
                que adoram um momento especial com os netos
              </p>
            </div>
            <div className="text-center p-4 bg-sky-100 border-2 border-ink rounded-2xl shadow-chunky-sm">
              <div className="text-3xl mb-2">🎨</div>
              <p className="font-display font-bold text-ink">Educadores</p>
              <p className="text-sm text-ink/70 mt-1">
                que buscam materiais prontos para a sala de aula
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4">
            Bora colorir? 🖍️
          </h2>
          <p className="text-lg text-ink/70 mb-6">
            Explore nosso acervo e encontre o desenho perfeito para a criançada.
          </p>
          <Link
            href="/buscar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-coral text-white font-display text-lg font-bold border-2 border-ink rounded-2xl shadow-chunky hover:-translate-y-0.5 transition-all"
          >
            Ver desenhos para colorir
          </Link>
        </section>

        {/* FALE CONOSCO */}
        <FaleConosco />
      </div>
    </div>
  );
}
