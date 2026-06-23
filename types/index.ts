/**
 * Tipos centrais do projeto DEPACO.
 * Espelha a estrutura do índice Algolia `depaco`.
 */

export interface AlgoliaDesenhoRecord {
  objectID: string;
  image_id: string;
  subject_id: string;
  subject_slug: string;
  personagem: string;
  idade_alvo: string;
  idade_alvo_raw: string;
  pose: string;
  pose_en: string;
  cenario: string;
  cenario_en: string;
  composicao: string;
  composicao_en: string;
  cenario_grupo?: string;
  pose_tipo?: string;
  url_imagem: string;
  s3_path: string;
}

export interface Personagem {
  slug: string;
  nome: string;
  categoria: string;
  subcategoria?: string;
  total_desenhos: number;
  imagem_thumb?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  cover?: string;
  content: string;
  related_personagem?: string;
  video_url?: string;   // URL do YouTube/Vimeo (embed) — opcional
  video_legenda?: string; // legenda curta sob o vídeo — opcional
}

export interface PackOferta {
  id: string;
  nome: string;
  descricao: string;
  total_desenhos: number;
  preco: number;
  preco_de?: number;
  url_checkout: string;
  preview_urls: string[];
  /** Palavras-chave que ativam este pack (minúsculas, sem acento). Vazio = pack geral. */
  keywords?: string[];
  /** Marca o pack que aparece quando nenhum temático casa. */
  isDefault?: boolean;
}
