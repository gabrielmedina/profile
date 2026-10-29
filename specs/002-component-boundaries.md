# 002 — Fronteira apresentação × domínio

**Status:** aceita

## Contexto

Componentes de UI acumulam regras (clipboard, speech synthesis, progresso de leitura, parsing de markdown). Isso dificulta teste, reuso e leitura. A refatoração exige que apresentação fique fina. O site também evita React client só para analytics ou copiar link: interação leve vive em `public/site.js`.

## Decisão

### O que pode viver num componente de apresentação

- Markup semântico e classes de estilo
- Composição de outros componentes
- Props tipadas já resolvidas (dados prontos)
- Atributos declarativos para o script do site (`data-track`, `data-copy`, `data-copy-code`, `data-speech`) via helpers como `trackAttrs`

### O que deve viver fora

| Tipo                              | Onde                                                                       |
| --------------------------------- | -------------------------------------------------------------------------- |
| Parsing, scoring, formatação pura | `features/<d>/utils/*.ts` ou `lib/*.ts`                                    |
| Validação de conteúdo / payloads  | Zod na borda (`services/posts.ts`, `services/get-profile.ts`)              |
| Estado + efeitos de browser       | Preferir `public/*.js` quando não precisa de React; senão `hooks/use-*.ts` |
| Tracking de analytics             | `trackAttrs` + `public/site.js` (sem SDK React)                            |
| Leitura de FS / rede              | `features/<d>/services/*.ts` com `server-only`                             |
| Helper só de um componente        | pasta desse componente (`share-targets.ts`, `speech-chrome.ts`)            |

### Regras práticas

1. Se um `.tsx` de apresentação passa de ~150–200 linhas por lógica (não por markup), extrair.
2. `'use client'` no menor pedaço possível. Lista de posts, compartilhar e copiar código **não** viram client por analytics/clipboard — usam `data-track` / `data-copy` / `data-copy-code`.
3. Ícones SVG inline podem ficar no componente de UI; a lógica ao redor não.
4. Páginas em `app/` recebem dados tipados e renderizam features; não calculam related posts “na mão” além de chamar a função do domínio.

## Consequências

- Speech: markup em `PostSpeech` + `components/post-speech/speech-chrome.ts`; texto falado em `utils/speech-text.ts`; runtime em `public/speech.js` (lazy). Não recriar player com hook React.
- Guia do artigo: markup em `PostOutline`; a árvore em `components/post-outline/outline.ts` reutiliza `uniqueHeadingId` para o `href` bater com o `id` do heading. A seção corrente e abrir/fechar subseções ficam em `public/site.js` (`data-article-outline`). Sem hook React. Sem script, as subseções continuam visíveis.
- Math de reading progress fica em `utils/reading-progress.ts`. Ids de heading do markdown ficam no helper puro ao lado de `Markdown`.
- A barra de progresso acompanha o scroll no compositor (`view-timeline` no trecho do artigo, `animation-range: contain`, `scaleX`). Medir o layout e animar `width` a cada frame força reflow e faz a barra travar. `public/site.js` só relê a geometria fora do scroll; sem scroll-driven animations, escreve `scaleX`.
- Testes unitários miram utils/hooks, não o JSX.
- Novos componentes client devem justificar a fronteira na review ou na spec relacionada.
- Não reintroduzir wrappers React (`TrackedLink`, `lib/analytics` client) para o que `site.js` já cobre. Eventos, funil de leitura e as métricas de clique e compartilhamento estão em `specs/005-analytics.md`.
- O filtro de assuntos marca a lista com `data-tag-list`. `public/site.js` rola só essa faixa até o assunto com `aria-current="page"`, encostado no canto direito quando a lista alcança, sem mover a página. A barra no desktop fica fina e usa a cor de texto do tema.
