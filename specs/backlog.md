# Backlog de refatoração

Status: `feito` | `em progresso` | `próximo` | `depois`.

## Onda 1 (PR #43)

| Item                                                          | Spec            | Status |
| ------------------------------------------------------------- | --------------- | ------ |
| Introduzir `specs/` e documentar decisões                     | README, 001–004 | feito  |
| Extrair math de reading progress para util puro               | 002             | feito  |
| Extrair ids de heading do markdown                            | 002             | feito  |
| `PostItem` / share como Server Component + `trackAttrs`       | 002             | feito  |
| Hierarquia de headings na listagem e no footer                | 003             | feito  |
| Assuntos do post como lista semântica                         | 003             | feito  |
| Hierarquia `h2`/`h3` em listagem vs relacionados              | 003             | feito  |
| Unificar contagem de palavras / tempo de leitura              | 003             | feito  |
| Feed RSS usa keywords tipadas                                 | 003             | feito  |
| Trocar capa OG `referencia-tecnica.png` (1.2 MB) por JPG leve | 004             | feito  |

## Onda 2

| Item                                                                | Spec                  | Status |
| ------------------------------------------------------------------- | --------------------- | ------ |
| Documentar validação via Vercel preview (sem walkthrough no Cursor) | AGENTS / README specs | feito  |
| Zod: wire `keys` → `keywords: string[]` na borda                    | 001, 003              | feito  |
| Campo `updated` no frontmatter → `dateModified` / `modifiedTime`    | 003                   | feito  |
| `aria-label` pt-BR no theme switcher                                | —                     | feito  |
| Afinar chrome de `PostSpeech` (`speech-chrome.ts`; sem hook React)  | 002                   | feito  |

## Onda 3

| Item                                                               | Spec     | Status |
| ------------------------------------------------------------------ | -------- | ------ |
| Pasta por componente de feature (tsx + SCSS + helper privado)      | 001, 002 | feito  |
| I/O do domínio em `services/`; regra pura em `utils/`              | 001, 002 | feito  |
| `share-targets` e `speech-chrome` colados no componente que os usa | 002      | feito  |
| `Profile` sai da raiz da feature e entra em `components/profile/`  | 001      | feito  |

## Propostas para o refactor geral

Ainda não implementadas. A onda 3 só fixa a árvore; estas decisões ficam para a próxima passagem.

| Item                                                                                                    | Spec | Status | Notas                                                                                             |
| ------------------------------------------------------------------------------------------------------- | ---- | ------ | ------------------------------------------------------------------------------------------------- |
| Renomear `services/posts.ts` → `services/get-posts.ts`                                                  | 001  | depois | O arquivo diz o substantivo, não a leitura. `get-profile.ts` já usa o verbo.                      |
| Extrair o schema Zod dos services para um módulo de borda                                               | 001  | depois | Hoje a validação vive no meio de `readPost` / `getProfile`. Testar sem FS nem rede.               |
| Decidir o destino de `utils/reading-progress.ts`                                                        | 002  | depois | Nenhum import TS. A conta real está duplicada em `public/site.js`.                                |
| Mover `utils/speech-text.ts` para `components/post-speech/` se a regra virar "um consumidor, uma pasta" | 002  | depois | Nesta onda ficou em `utils/` por ser parsing de markdown, não chrome de UI.                       |
| Não introduzir `index.ts` nas pastas de componente                                                      | 001  | depois | O caminho repete o nome, como em `src/components`. Barrel mistura server e client com facilidade. |
| `hooks/` continua inexistente até o primeiro `use-*`                                                    | 002  | depois | Pasta vazia não explica nada. Share, speech e progresso seguem em `public/*.js`.                  |

## Onda 4 (esta PR)

| Item                                                                                    | Spec | Status |
| --------------------------------------------------------------------------------------- | ---- | ------ |
| Identidade do site em `src/config` (`site.ts`, `absolute-url.ts`)                       | 001  | feito  |
| `lib/format` para data longa e data RFC 822; `lib/seo` para metadata e grafo schema.org | 001  | feito  |
| `safe-json` vira `json-for-script`; `JsonLd` usa o mesmo escape                         | 001  | feito  |
| `heading-slug` cola no markdown; `track-attrs` cola no analytics; tema cola no theme    | 001  | feito  |

## Onda 5

| Item                                                           | Spec | Status |
| -------------------------------------------------------------- | ---- | ------ |
| Assuntos canônicos (`tags.ts`): aliases e dedupe por slug      | 003  | feito  |
| Página `/assuntos/[slug]`; `/posts` é a entrada dos assuntos   | 003  | feito  |
| Filtro de assuntos em `/posts` e links `rel="tag"` no artigo   | 003  | feito  |
| Sitemap e `BlogPosting.about` apontam para a página do assunto | 003  | feito  |

## Onda 6

| Item                                                                            | Spec     | Status |
| ------------------------------------------------------------------------------- | -------- | ------ |
| Blocos de código com highlight (Shiki) + copiar (`data-copy-code` em `site.js`) | 002, 003 | feito  |

## Próximas ondas

| Item                                                                 | Spec     | Status  | Notas                       |
| -------------------------------------------------------------------- | -------- | ------- | --------------------------- |
| Cover figure opcional no chrome do artigo                            | 003, 004 | próximo | `post.image` + `next/image` |
| Mostrar `<time>` de atualização no artigo quando houver `updated`    | 003      | próximo | UI alinhada ao SEO          |
| Enclosure/imagem no RSS                                              | 003, 004 | depois  | Usar `post.image`           |
| Testes unitários de `related`, `speech-text`, `image-size`, metadata | 002      | próximo | Ancorar SDD com regressão   |
| Política / sanitizer se `rehype-raw` sair de conteúdo só do repo     | 003      | depois  | Documentar trust model      |
| Cache helper de related posts por slug                               | 001      | depois  | Micro-otimização            |
| Placeholder blur em capas LCP                                        | 004      | depois  | Opcional                    |
| Checagem de tamanho de asset no CI                                   | 004      | depois  | Falhar build se OG > limiar |
| Alinhar capas antigas ao fundo `#1a1d24` e à regra de logo oficial   | 004      | depois  | Só novas capas já seguem; backfill opcional |

## Critério para fechar um item

1. Código alinhado à spec citada (ou spec atualizada no mesmo PR).
2. `npm run typecheck` e `npm run lint` verdes.
3. Sem misturar server/client em barrel novo.
4. Entrega no PR; validação visual no preview da Vercel.
