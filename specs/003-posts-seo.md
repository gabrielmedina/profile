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
- Grafias e o mesmo conceito viram uma tag só: `Frontend` → `Front-end`; `AI` / `IA` → `IA`; `Componentes` → `Design System`; `Nx` → `Monorepos`; `Mentoria` → `Liderança Técnica`; `Estado`, `TanStack Query` e `React Query` → `React`.
- Permanecem distintos: `Software Engineering` e `Cultura de Engenharia` (ofício e cultura do time); `Context API` e `React` (o mecanismo e o ecossistema). Um alias como `Engenharia de software` cai em `Software Engineering`, para não abrir uma segunda tag do mesmo ofício.
- `Breaking Changes` não é assunto. O texto continua no post; a página do tema não existe.
- Slugs aposentados redirecionam em definitivo: `/assuntos/estado` e `/assuntos/tanstack-query` → `/assuntos/react`; `/assuntos/nx` → `/assuntos/monorepos`; `/assuntos/mentoria` → `/assuntos/lideranca-tecnica`; `/assuntos/breaking-changes` → `/assuntos/design-system`.
- Assunto fora do catálogo ainda publica, com slug estável e descrição genérica. Descrição editorial entra no catálogo.

### Hierarquia de headings no site

- Uma página, um `<h1>` principal da view.
- Subtítulos de marketing na listagem de posts são `<p>`, não `<h2>` falso.
- Itens da listagem de posts usam `<h2>`; itens em “Continue lendo” (sob um `<h2>` de seção) usam `<h3>`.
- Rodapé do site: nome/marca como texto destacado (`<p>`), não heading que quebre o outline.
- Filtro de assuntos na listagem é `<nav aria-label="Filtrar por assunto">`, com rótulo em `<p>`. O assunto corrente (ou “Todos” em `/posts`) usa `aria-current="page"`. A página do assunto usa `<h1>` com o nome do tema; os posts seguem como `<h2>`.

### Assuntos

`/posts` é a entrada dos assuntos. Cada tema tem a própria URL canônica em `/assuntos/[slug]`; essa página lista só os posts daquele slug.

1. **Assunto** (`app/assuntos/[slug]/page.tsx`): `CollectionPage` + `ItemList` + `BreadcrumbList` (Início, Posts, assunto), com `about` `DefinedTerm`. `generateStaticParams` só emite assuntos que têm post. Slug desconhecido chama `notFound()`.
2. **Filtro**: `/posts` e a página do assunto compartilham os mesmos links. A URL canônica do filtro é `/assuntos/[slug]`.
3. **Artigo**: cada assunto é um link com `rel="tag"` para a página do assunto. `BlogPosting.about` repete esses `DefinedTerm`, e `inDefinedTermSet` aponta para `/posts`.
4. **Sitemap**: cada `/assuntos/[slug]`, com `lastModified` do post mais recente daquele assunto.
5. Posts relacionados pontuam pelo slug canônico, não pela grafia crua do `keys`.
6. Na navegação, Posts continua sendo o item corrente também em `/assuntos/[slug]`.

### Conteúdo Markdown

- Fonte confiável: arquivos versionados em `content/posts` (autor do repo).
- `rehype-raw` só enquanto essa premissa valer; se a fonte mudar, exigir sanitização (backlog).

## Consequências

- Qualquer nova superfície de post (cover figure, TOC) atualiza esta spec.
- Feed RSS reutiliza os `keywords` canônicos (o mesmo nome que a página, o filtro e o JSON-LD).
- Contagem de palavras / tempo de leitura usam o mesmo pipeline de texto limpo.
