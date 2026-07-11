/**
 * Páginas SEO do nicho "fofo/kawaii".
 *
 * Baseado em dados reais do DataForSEO (Brasil, pt):
 *   - "desenhos fofos para colorir"    -> 40.500/mês  (LOW)
 *   - "desenhos fofinhos para colorir" -> 40.500/mês  (LOW)
 *   - "desenhos fofos para colorir de animais" -> 3.600/mês
 *   - "desenhos kawaii para colorir"   ->  2.900/mês
 *   - "desenhos fofinhos para imprimir"->  2.900/mês
 *   - gatos/gatinhos fofos             ->  4.560/mês
 *   - cachorros/cachorrinhos fofos     ->  2.490/mês
 *
 * IMPORTANTE: "fofo" e "fofinho" têm o MESMO volume — as duas variantes
 * aparecem no conteúdo de propósito. "cozy" não tem volume no Brasil.
 *
 * Só entram aqui páginas que o acervo atual sustenta.
 * Para adicionar (ex.: pandas), basta gerar os desenhos e criar a entrada.
 */

export interface PaginaFofa {
  slug: string;
  /** filtro/termo usado no Algolia */
  busca: { tipo: 'filtro'; valor: string } | { tipo: 'bichinho'; valor: string };
  /** busca textual de reserva, caso o filtro por faceta não funcione */
  fallbackQuery?: string;
  /** <title> da aba/SERP */
  title: string;
  /** meta description */
  description: string;
  /** H1 visível */
  h1: string;
  /** subtítulo abaixo do H1 */
  subtitulo: string;
  /** parágrafo de conteúdo SEO (usa fofo E fofinho) */
  texto: string;
  emoji: string;
  /** se true, dá destaque ao CTA do pack (público com intenção de imprimir) */
  focoNoPack?: boolean;
}

/**
 * Filtro dos desenhos fofos no Algolia.
 *
 * IMPORTANTE: usa `tema` (e NÃO `subcategoria`), porque o script
 * "Monta JSON" do n8n só envia `tema` ao índice — `subcategoria`
 * existe na planilha mas nunca chega ao Algolia.
 *
 * Aceita os três valores (OR) para cobrir os registros antigos e novos.
 */
const FILTRO_FOFO = 'tema:"fofo" OR tema:"cozy" OR tema:"bobbie-goods"';

export const PAGINAS_FOFAS: PaginaFofa[] = [
  {
    slug: 'desenhos-fofos-para-colorir',
    busca: { tipo: 'filtro', valor: FILTRO_FOFO },
    fallbackQuery: 'ursinho gatinho cachorrinho coelhinho patinho',
    title: 'Desenhos Fofos para Colorir — Grátis para Imprimir | DEPACO',
    description:
      'Desenhos fofos e fofinhos para colorir e imprimir de graça. Ursinhos, gatinhos, cachorrinhos e coelhinhos em cenas do dia a dia. Prontos para A4.',
    h1: 'Desenhos fofos para colorir',
    subtitulo: 'Bichinhos fofinhos em cenas do dia a dia — prontos para imprimir',
    texto:
      'Aqui você encontra desenhos fofos para colorir de graça, prontos para imprimir em folha A4. São bichinhos fofinhos — ursinhos, gatinhos, cachorrinhos, coelhinhos e patinhos — em cenas aconchegantes do dia a dia: fazendo bolo na cozinha, cuidando do jardim, lendo na cama, brincando na chuva. Os traços são grossos e limpos, ideais para lápis de cor, giz de cera ou canetinha. Tem opções mais simples para os pequenos de 2 a 5 anos e cenas com mais detalhes para crianças de 6 a 12 anos.',
    emoji: '🧸',
  },
  {
    slug: 'gatinhos-fofos-para-colorir',
    busca: { tipo: 'bichinho', valor: 'gatinho' },
    title: 'Gatinhos Fofos para Colorir — Desenhos Grátis para Imprimir | DEPACO',
    description:
      'Desenhos de gatinhos fofos para colorir e imprimir grátis. Gatos fofinhos em cenas do dia a dia, com traço simples e fácil de pintar.',
    h1: 'Gatinhos fofos para colorir',
    subtitulo: 'Gatos fofinhos prontos para imprimir e pintar',
    texto:
      'Desenhos de gatinhos fofos para colorir, de graça e prontos para imprimir. Os gatos fofinhos aparecem em cenas do cotidiano — tomando chá, brincando com novelo, lendo um livro, dormindo no travesseiro. O traço é grosso e arredondado, perfeito para a criança pintar sem sair da linha.',
    emoji: '🐱',
  },
  {
    slug: 'cachorrinhos-fofos-para-colorir',
    busca: { tipo: 'bichinho', valor: 'cachorrinho' },
    title: 'Cachorrinhos Fofos para Colorir — Grátis para Imprimir | DEPACO',
    description:
      'Desenhos de cachorrinhos fofos para colorir e imprimir grátis. Cachorros fofinhos em cenas divertidas, com traço fácil de pintar.',
    h1: 'Cachorrinhos fofos para colorir',
    subtitulo: 'Cachorros fofinhos prontos para imprimir e pintar',
    texto:
      'Desenhos de cachorrinhos fofos para colorir, gratuitos e prontos para imprimir em A4. Os cachorros fofinhos aparecem decorando cupcakes, passeando de patins, tomando banho de espuma e relaxando no sofá. Linhas grossas e limpas, ideais para lápis de cor e giz de cera.',
    emoji: '🐶',
  },
  {
    slug: 'animais-fofos-para-colorir',
    busca: { tipo: 'filtro', valor: FILTRO_FOFO },
    fallbackQuery: 'ursinho gatinho cachorrinho coelhinho patinho',
    title: 'Animais Fofos para Colorir — Desenhos Grátis para Imprimir | DEPACO',
    description:
      'Desenhos de animais fofos para colorir e imprimir grátis. Bichinhos fofinhos: ursinho, gatinho, cachorrinho, coelhinho e patinho.',
    h1: 'Animais fofos para colorir',
    subtitulo: 'Bichinhos fofinhos de todo tipo, prontos para imprimir',
    texto:
      'Coleção de animais fofos para colorir, com desenhos gratuitos prontos para imprimir. Reunimos bichinhos fofinhos de vários tipos — ursinhos, gatinhos, cachorrinhos, coelhinhos e patinhos — sempre em cenas simpáticas do dia a dia. É um jeito gostoso de a criança passar um tempo longe da tela, treinando coordenação e criatividade.',
    emoji: '🐾',
  },
  {
    slug: 'desenhos-kawaii-para-colorir',
    busca: { tipo: 'filtro', valor: FILTRO_FOFO },
    fallbackQuery: 'ursinho gatinho cachorrinho coelhinho patinho',
    title: 'Desenhos Kawaii para Colorir — Grátis para Imprimir | DEPACO',
    description:
      'Desenhos kawaii para colorir e imprimir grátis. Personagens fofinhos no estilo kawaii, com traço arredondado e fácil de pintar.',
    h1: 'Desenhos kawaii para colorir',
    subtitulo: 'Personagens fofinhos no estilo kawaii, prontos para imprimir',
    texto:
      'Desenhos kawaii para colorir, grátis e prontos para imprimir. O estilo kawaii é conhecido pelos personagens fofos de corpo redondo, olhinhos simples e expressão alegre — é exatamente o que você encontra aqui. São bichinhos fofinhos em cenas aconchegantes, com traço limpo e grosso, feito para colorir sem dificuldade.',
    emoji: '✨',
  },
  {
    slug: 'desenhos-fofos-para-imprimir',
    busca: { tipo: 'filtro', valor: FILTRO_FOFO },
    fallbackQuery: 'ursinho gatinho cachorrinho coelhinho patinho',
    title: 'Desenhos Fofos para Imprimir — Grátis em A4 | DEPACO',
    description:
      'Desenhos fofinhos para imprimir de graça, em folha A4. Baixe agora e imprima em casa: bichinhos fofos prontos para colorir.',
    h1: 'Desenhos fofos para imprimir',
    subtitulo: 'Baixe e imprima em casa, em folha A4 comum',
    texto:
      'Desenhos fofos para imprimir na hora, sem cadastro e sem pagar nada. É só escolher o bichinho fofinho, baixar o arquivo e mandar para a impressora — o tamanho já está pronto para folha A4 comum. Se quiser tudo de uma vez, o pack completo reúne mais de mil desenhos organizados por idade e tema.',
    emoji: '🖨️',
    focoNoPack: true,
  },
];

export function getPaginaFofa(slug: string): PaginaFofa | undefined {
  return PAGINAS_FOFAS.find((p) => p.slug === slug);
}
