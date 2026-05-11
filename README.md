# DEPACO — Site de Desenhos para Colorir

Site Next.js 15 com busca Algolia, otimizado para SEO e conversão.

## 🚀 Quick start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local e preencha as chaves do Algolia + dados do pack

# 3. Rodar local
npm run dev
# → http://localhost:3000

# 4. Build produção
npm run build
npm run start
```

## 📦 Stack

- **Next.js 15** com App Router (SSG/ISR)
- **React 19** + TypeScript
- **Tailwind v3** com design system DEPACO (paleta mostarda + coral + terracotta)
- **Algolia** para busca instantânea (autocomplete + InstantSearch)
- **Supabase Storage** para imagens
- **Fredoka + Plus Jakarta Sans** (fontes)

## 🎨 Paleta DEPACO (baseada na logomarca)

| Cor | Hex | Uso |
|---|---|---|
| Mostarda | `#F4B936` | Primária — botões secundários, destaques |
| Coral | `#F87956` | Secundária — links, highlights |
| Terracotta | `#E04E32` | Acento — CTA principal (compra) |
| Ink | `#1F1F1F` | Texto, outlines (estilo chunky) |
| Cream | `#FDFBF7` | Fundo |
| Sky | `#7AC4D6` | Acento azul (para variação) |

## 📁 Estrutura

```
app/
├── page.tsx                          # Home com busca em destaque
├── layout.tsx                        # Layout raiz (Header + Footer)
├── globals.css                       # Tailwind + estilos Algolia
├── sitemap.ts                        # Sitemap dinâmico do Algolia
├── robots.ts                         # robots.txt
├── not-found.tsx                     # 404 customizado
│
├── buscar/page.tsx                   # Página de busca (InstantSearch)
├── desenhos/[id]/page.tsx            # Página individual do desenho
├── personagem/[slug]/page.tsx        # Listagem por personagem
├── categorias/[categoria]/page.tsx   # Listagem por categoria
├── blog/page.tsx                     # Listagem do blog
├── blog/[slug]/page.tsx              # Post individual
└── pack/[id]/page.tsx                # Página de oferta/checkout

components/
├── Logo.tsx                          # Logo SVG inline
├── Header.tsx                        # Header sticky com busca
├── Footer.tsx
├── SearchAutocomplete.tsx            # Autocomplete Algolia (client)
├── DesenhoCard.tsx                   # Card pra grid
├── DesenhoActions.tsx                # Botões baixar/imprimir (client)
└── OfertaCard.tsx                    # Card de oferta (sidebar/compact/sticky-mobile)

lib/
├── algolia.ts                        # Cliente + helpers Algolia
├── supabase.ts                       # Helpers de URL e download
├── blog.ts                           # Sistema de posts Markdown
├── oferta.ts                         # Config do pack premium
└── utils.ts                          # cn(), slugify(), capitalize()

content/blog/
├── como-escolher-desenho-para-colorir.md
└── stitch-personagem-favorito.md

types/index.ts                        # Tipos TypeScript do domínio
```

## 🔧 Configuração inicial

### 1. Algolia

1. Acesse [dashboard.algolia.com](https://dashboard.algolia.com)
2. Cria aplicação (ou usa existente)
3. Copia as chaves para `.env.local`:
   - `NEXT_PUBLIC_ALGOLIA_APP_ID`
   - `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` (chave **search-only**, segura no client)
   - `NEXT_PUBLIC_ALGOLIA_INDEX_NAME=depaco`

4. **No painel do Algolia, configure o índice `depaco`:**

   **Configuration → Searchable attributes** (ordem importa):
   ```
   1. personagem
   2. pose
   3. cenario
   4. composicao
   5. pose_en (unordered)
   6. cenario_en (unordered)
   ```

   **Configuration → Facets → filterable**:
   ```
   - idade_alvo_raw
   - subject_slug
   - pose_tipo
   - cenario_grupo
   ```

   **Configuration → Synonyms** (recomendado):
   ```
   stitch ↔ stich, lilo e stitch
   homem-aranha ↔ spider-man, aranha
   capivara ↔ kapibara
   princesa ↔ princess
   dinossauro ↔ dino, t-rex
   ```

### 2. Supabase

Variáveis já preenchidas no `.env.example` com seus valores. Se mudar:
- `NEXT_PUBLIC_SUPABASE_PROJECT_REF=zoffnfpjwpfzqcxlfqad`
- `NEXT_PUBLIC_SUPABASE_BUCKET=Desenhos_para_Colorir`

### 3. Pack Premium

Edita `lib/oferta.ts` ou via env:
- `NEXT_PUBLIC_PACK_CHECKOUT_URL` — link da Hotmart/Eduzz/Stripe
- `NEXT_PUBLIC_PACK_PRICE=19.90`
- `NEXT_PUBLIC_PACK_QUANTITY=300`

## 🚢 Deploy na Vercel

```bash
# 1. Cria conta na Vercel (grátis)
# 2. Conecta seu repo GitHub
# 3. Adicione TODAS as variáveis de .env.local em
#    Settings → Environment Variables
# 4. Deploy automático a cada push na main
```

Domínio personalizado:
- Vercel → Settings → Domains → Add `depaco.com.br`
- Aponta CNAME no Hostinger pra `cname.vercel-dns.com`
- SSL automático.

## 📈 SEO já configurado

✅ Metadata dinâmica por página
✅ Open Graph + Twitter Cards
✅ Sitemap.xml automático (todas URLs do Algolia)
✅ robots.txt
✅ Schema.org `ImageObject` em desenhos
✅ Schema.org `Article` em posts
✅ Schema.org `Product` na página do pack
✅ Canonical URLs
✅ Hierarquia correta de H1/H2/H3
✅ `<title>` único por página
✅ Imagens otimizadas (AVIF/WebP)
✅ Lazy loading nativo
✅ Texto SEO em cada página de desenho

## 📝 Adicionar post no blog

Cria arquivo em `content/blog/meu-post.md`:

```markdown
---
title: 'Título do post'
description: 'Descrição curta para SEO'
date: '2026-05-11'
author: 'Equipe DEPACO'
tags: ['tag1', 'tag2']
cover: 'https://...url-da-capa.jpg'
related_personagem: 'stitch'
---

Conteúdo em Markdown aqui.

## Subtítulo

Parágrafo com **negrito**, *itálico*, [link](/url).
```

## 🎯 Estratégia de conversão

A página do desenho tem **3 momentos de venda**:

1. **OfertaCard sticky** na sidebar (desktop) — sempre visível enquanto rola
2. **OfertaCard sticky** no rodapé (mobile) — não sai da tela
3. **OfertaCard compact** após desenhos relacionados — pega quem chegou até o fim

A página do pack tem **funil completo**:
- Hero com preço e prova social
- Lista de benefícios
- FAQ pra remover objeções
- CTA final repetido

## 🐛 Debug comum

**Imagens não carregam?**
→ Verifica `next.config.mjs` — `remotePatterns` precisa incluir seu domínio Supabase.

**Busca retorna vazio?**
→ Confirma que o índice Algolia tem registros. Use o dashboard do Algolia pra verificar.

**Build falha em produção?**
→ Confere se TODAS as env vars estão na Vercel (não só localmente).

## 📚 Documentação

- [Next.js](https://nextjs.org/docs)
- [Algolia React InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/getting-started/react/)
- [Tailwind](https://tailwindcss.com/docs)
