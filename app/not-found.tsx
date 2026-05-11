import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="text-9xl font-display font-bold text-mustard mb-4">404</div>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">
        Esse desenho fugiu pra brincar!
      </h1>
      <p className="text-ink/60 mb-8 max-w-md mx-auto">
        Não conseguimos encontrar o que você procura. Que tal voltar pro início?
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-cream rounded-2xl font-bold border-2 border-ink shadow-chunky hover:translate-y-[-2px] hover:shadow-chunky-lg transition-all"
      >
        ← Voltar ao início
      </Link>
    </div>
  );
}
