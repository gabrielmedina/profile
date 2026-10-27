# 003 — Publicações: SEO e HTML5 semântico

**Status:** aceita

## Contexto

Posts são o conteúdo indexável do site. Metadata, JSON-LD e markup precisam contar a mesma história e usar elementos HTML5 com hierarquia de headings coerente.

## Decisão

### Contrato de uma página de post

1. **Rota** (`app/posts/[slug]/page.tsx`): `generateMetadata`, JSON-LD (`BlogPosting` + `BreadcrumbList`), analytics de page view, render de `PostArticle`.
2. **Artigo** (`PostArticle`): `<article lang={post.lang}>` com:
   - breadcrumbs em `<nav>`
   - `<header>` com `<h1>` (título) e descrição em `<p>`
   - metadados: autor (`rel="author"`), tempo de leitura, `<time dateTime>`
   - corpo em container com landmark claro (conteúdo principal do artigo)
   - assuntos como lista semântica (`<ul>` / `<li>`), cada item com link `rel="tag"`
   - compartilhar / relacionados como seções com heading próprio
3. **Markdown**: headings `h2+` com `id` estável; imagens via `next/image` quando o tamanho é conhecido; sem `h1` no corpo (o `h1` é o título do artigo).

### Metadata e structured data

- Canonical + alternate RSS em toda página pública.
- Open Graph `type: article` com `publishedTime`, `modifiedTime`, `tags`, `section`.
- JSON-LD alinhado aos mesmos campos (título, descrição, datas, keywords, `wordCount`, imagem).
- Frontmatter opcional `updated` (YYYY-MM-DD, ≥ `date`) alimenta `modifiedTime` / `dateModified`. Sem `updated`, `dateModified` espelha `datePublished`.
- No domínio tipado, assuntos são `tags: { slug, name }[]` e `keywords: string[]` (os nomes canônicos, na mesma ordem). O Markdown continua com o campo wire `keys` (string). Na borda, `splitKeywords` + `canonicalizeTags` (`utils/tags.ts`) colapsam aliases e deduplicam pelo slug.
- Grafias e o mesmo conceito viram uma tag só: `Frontend` → `Front-end`; `AI` / `IA` → `IA`; `Componentes` → `Design System`; `React Query` → `TanStack Query`.
- Permanecem distintos: `Software Engineering` e `Cultura de Engenharia` (ofício e cultura do time); `Estado`, `Context API` e `TanStack Query` (o problema e cada mecanismo). Um alias como `Engenharia de software` cai em `Software Engineering`, para não abrir uma segunda tag do mesmo ofício.
- Assunto fora do catálogo ainda publica, com slug estável e descrição genérica. Descrição editorial entra no catálogo.

### Hierarquia de headings no site

- Uma página, um `<h1>` principal da view.
- Subtítulos de marketing na listagem de posts são `<p>`, não `<h2>` falso.
- Itens da listagem de posts usam `<h2>`; itens em “Continue lendo” (sob um `<h2>` de seção) usam `<h3>`.
- Rodapé do site: nome/marca como texto destacado (`<p>`), não heading que quebre o outline.
- Índice de assuntos: um `<h1>`; cada assunto é um `<h2>` dentro do link do card.
- Filtro de assuntos na listagem é `<nav aria-label="Filtrar por assunto">`, sem heading próprio. O assunto corrente (ou “Todos” em `/posts`) usa `aria-current="page"`.

### Assuntos

1. **Índice** (`app/assuntos/page.tsx`): `CollectionPage` + `ItemList` + `BreadcrumbList`. Cada item aponta para a página do assunto.
2. **Assunto** (`app/assuntos/[slug]/page.tsx`): mesma forma de collection, com `about` `DefinedTerm` e a lista dos posts daquele slug. `generateStaticParams` só emite assuntos que têm post. Slug desconhecido chama `notFound()`.
3. **Filtro**: `/posts` e a página do assunto compartilham os mesmos links. Não há `?assunto=` — a URL canônica do filtro é `/assuntos/[slug]`.
4. **Artigo**: cada assunto é um link com `rel="tag"` para a página do assunto. `BlogPosting.about` repete esses `DefinedTerm`.
5. **Sitemap**: `/assuntos` e cada `/assuntos/[slug]`, com `lastModified` do post mais recente daquele assunto.
6. Posts relacionados pontuam pelo slug canônico, não pela grafia crua do `keys`.

### Conteúdo Markdown

- Fonte confiável: arquivos versionados em `content/posts` (autor do repo).
- `rehype-raw` só enquanto essa premissa valer; se a fonte mudar, exigir sanitização (backlog).

## Consequências

- Qualquer nova superfície de post (cover figure, TOC) atualiza esta spec.
- Feed RSS reutiliza os `keywords` canônicos (o mesmo nome que a página, o filtro e o JSON-LD).
- Contagem de palavras / tempo de leitura usam o mesmo pipeline de texto limpo.
