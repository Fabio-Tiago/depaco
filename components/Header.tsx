import Link from 'next/link';
import { Logo } from './Logo';
import { SearchAutocomplete } from './SearchAutocomplete';

/**
 * Header sticky com logo + busca sempre visível.
 * A busca é o coração da UX — fica em destaque em TODAS as páginas.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b-2 border-ink/10">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center gap-3 md:gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Busca — ocupa todo espaço disponível */}
          <div className="flex-1 max-w-2xl">
            <SearchAutocomplete />
          </div>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-bold text-ink/70">
            <Link
              href="/buscar"
              className="px-3 py-2 rounded-lg hover:bg-mustard-100 hover:text-ink transition-colors"
            >
              Ver desenhos
            </Link>
            <Link href="/atividades-educativas">Atividades</Link>
            <Link
              href="/blog"
              className="px-3 py-2 rounded-lg hover:bg-mustard-100 hover:text-ink transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/packs"
              className="ml-2 px-4 py-2 bg-terracotta text-cream rounded-xl font-bold border-2 border-ink shadow-chunky-sm hover:translate-y-[-2px] hover:shadow-chunky transition-all"
            >
              Packs
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
