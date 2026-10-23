# 001 — Arquitetura e hierarquia de pastas

**Status:** aceita

## Contexto

O site é um perfil pessoal com posts em Markdown. Precisamos de uma árvore previsível para humanos e agentes navegarem sem adivinhar onde mora cada responsabilidade.

## Decisão

Mantemos e reforçamos a separação já descrita no `AGENTS.md` e no `README.md`:

```text
src/app            rotas finas: dados, metadata, composição
src/features/<d>   domínio (posts, profile): ver árvore abaixo
src/components     UI compartilhada (nav, markdown, seo, tema…)
src/lib            helpers puros / sem UI (ou cliente explícito raro)
src/styles         tokens, reset, tema global
content/posts      markdown publicado
public/            assets estáticos
specs/             decisões e backlog (este diretório)
```

Dentro de cada feature, a raiz não acumula módulos soltos. O papel fica no nome da pasta:

```text
src/features/<domínio>/
  types.ts                         contrato do domínio (um arquivo, nome explícito)
  components/<nome>/               tsx + estilo + helper que só esse componente usa
  services/                        leitura de filesystem ou rede (`server-only`)
  utils/                           regra pura: parsing, scoring, formatação
  hooks/                           só quando existir `use-*` (não criar pasta vazia)
```

### Nomes e hierarquia

- Arquivos e pastas em **kebab-case** (`post-article.tsx`, `reading-progress.ts`).
- Componente de feature: `src/features/<domínio>/components/<nome>/<nome>.tsx` mais o SCSS module ao lado. Helper privado (URL de share, chrome de speech) mora nessa mesma pasta. Não criar `index.ts`.
- I/O do domínio: `src/features/<domínio>/services/` (`posts.ts`, `image-size.ts`, `get-profile.ts`).
- Regra pura do domínio: `src/features/<domínio>/utils/` (`related.ts`, `keywords.ts`, `speech-text.ts`).
- Hooks de cliente: `src/features/<domínio>/hooks/use-<nome>.ts`, e só a partir do primeiro hook. Interação que cabe em `public/*.js` não ganha hook React.
- `types.ts` fica na raiz da feature enquanto for um único módulo de contrato. Um segundo arquivo de tipos abre `types/`, não volta a espalhar `.ts` na raiz.
- UI compartilhada: um diretório por componente em `src/components/<nome>/`, com SCSS co-localizado.
- Rotas em `src/app` **não** contêm regra de negócio nem parsing de conteúdo.

### Imports

- Importar sempre o módulo dono do símbolo (`@/features/posts/services/posts`, não um barrel genérico).
- **Proibido** `index.ts` de feature que misture `server-only` e `'use client'`.
- Preferir zero barrels; se um dia existirem, separar pacotes client-only / server-only / types-only.

### Server vs client

- Server Components por padrão.
- `'use client'` só para estado, efeitos, APIs de browser ou requisitos do framework (`error.tsx`).
- Módulos que leem filesystem ou rede remota: `import 'server-only'`, `use cache` e `cacheLife` explícito.

## Consequências

- Novas telas começam na rota (`app`) e empurram lógica para `features` / `lib`.
- Renomeações devem preservar o vocabulário do domínio (`Post`, `PostSummary`, `PostArticle`, `PostList`, `PostItem`).
- Analytics e clipboard no browser: `src/lib/track-attrs.ts` + `public/site.js` (sem SDK React). Page views via `src/components/analytics/page-view.tsx`.
