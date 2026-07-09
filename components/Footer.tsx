import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t-2 border-ink/10 mt-20 bg-mustard-50/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" />
            <p className="mt-3 text-sm text-ink/70 leading-relaxed">
              Desenhos para colorir prontos para imprimir. Diversão garantida para a criançada.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-ink mb-3">Explorar</h3>
            <ul className="space-y-2 text-sm text-ink/70">
              <li><Link href="/buscar" className="hover:text-coral">Ver desenhos</Link></li>
              <li><Link href="/packs" className="hover:text-coral">Packs</Link></li>
              <li><Link href="/blog" className="hover:text-coral">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-ink mb-3">Packs</h3>
            <ul className="space-y-2 text-sm text-ink/70">
              <li><Link href="/packs" className="hover:text-coral">Todos os packs</Link></li>
              <li><Link href="/pack/mega-pack-desenhos-para-colorir" className="hover:text-coral">Mega Pack</Link></li>
              <li><Link href="/pack/pack-esporte" className="hover:text-coral">Pack Esporte</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-ink mb-3">DEPACO</h3>
            <ul className="space-y-2 text-sm text-ink/70">
              <li><Link href="/" className="hover:text-coral">Início</Link></li>
              <li><Link href="/sobre" className="hover:text-coral">Sobre</Link></li>
              <li><Link href="/contato" className="hover:text-coral">Contato</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-ink/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-ink/50">
          <p>© {new Date().getFullYear()} DEPACO — Desenhos para colorir. <a href="https://fabiotiago.com.br" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink/80">Feito por Fábio Tiago</a></p>
          <p>Feito por um pai com carinho para a criançada brasileira ✨</p>
        </div>
      </div>
    </footer>
  );
}
