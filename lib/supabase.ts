/**
 * Helpers do Supabase Storage.
 * Constrói URLs públicas a partir do path do objeto.
 */

const PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || 'zoffnfpjwpfzqcxlfqad';
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'Desenhos_para_Colorir';

/**
 * Monta URL pública a partir do s3_path (caminho interno do bucket).
 * Codifica cada segmento mas preserva as barras.
 */
export function buildSupabaseUrl(s3Path: string): string {
  if (!s3Path) return '';
  if (s3Path.startsWith('http')) return s3Path;

  const encodedKey = s3Path.split('/').map(encodeURIComponent).join('/');
  return `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/${BUCKET}/${encodedKey}`;
}

/**
 * Força download de imagem em vez de abrir no navegador.
 * Útil pro botão "Baixar PNG".
 */
export async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    console.error('Erro ao baixar imagem:', e);
    // Fallback: abre em nova aba
    window.open(url, '_blank');
  }
}
