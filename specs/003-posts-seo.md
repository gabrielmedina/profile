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
   - assuntos como lista semântica (`<ul>` / `<li>`), não blob de texto
   - compartilhar / relacionados como seções com heading próprio
3. **Markdown**: headings `h2+` com `id` estável; imagens via `next/image` quando o tamanho é conhecido; sem `h1` no corpo (o `h1` é o título do artigo).

### Metadata e structured data

- Canonical + alternate RSS em toda página pública.
- Open Graph `type: article` com `publishedTime`, `modifiedTime`, `tags`, `section`.
- JSON-LD alinhado aos mesmos campos (título, descrição, datas, keywords, `wordCount`, imagem).
- Quando existir `updated` no frontmatter, usar em `modifiedTime` / `dateModified`; até lá, `dateModified` pode espelhar `datePublished` (documentado no backlog para evolução).

### Hierarquia de headings no site

- Uma página, um `<h1>` principal da view.
- Subtítulos de marketing na listagem de posts são `<p>`, não `<h2>` falso.
- Itens da listagem de posts usam `<h2>`; itens em “Continue lendo” (sob um `<h2>` de seção) usam `<h3>`.
- Rodapé do site: nome/marca como texto destacado (`<p>`), não heading que quebre o outline.

### Conteúdo Markdown

- Fonte confiável: arquivos versionados em `content/posts` (autor do repo).
- `rehype-raw` só enquanto essa premissa valer; se a fonte mudar, exigir sanitização (backlog).

## Consequências

- Qualquer nova superfície de post (cover figure, tags linkadas, TOC) atualiza esta spec.
- Feed RSS reutiliza o mesmo parser de keywords (`splitKeywords`) que a página e o JSON-LD.
- Contagem de palavras / tempo de leitura usam o mesmo pipeline de texto limpo.
