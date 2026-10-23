# 002 — Fronteira apresentação × domínio

**Status:** aceita

## Contexto

Componentes de UI acumulam regras (clipboard, speech synthesis, progresso de leitura, parsing de markdown). Isso dificulta teste, reuso e leitura. A refatoração exige que apresentação fique fina. O site também evita React client só para analytics ou copiar link: interação leve vive em `public/site.js`.

## Decisão

### O que pode viver num componente de apresentação

- Markup semântico e classes de estilo
- Composição de outros componentes
- Props tipadas já resolvidas (dados prontos)
- Atributos declarativos para o script do site (`data-track`, `data-copy`, `data-speech`) via helpers como `trackAttrs`

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
2. `'use client'` no menor pedaço possível. Lista de posts e compartilhar **não** viram client por analytics — usam `data-track` / `data-copy`.
3. Ícones SVG inline podem ficar no componente de UI; a lógica ao redor não.
4. Páginas em `app/` recebem dados tipados e renderizam features; não calculam related posts “na mão” além de chamar a função do domínio.

## Consequências

- Speech: markup em `PostSpeech` + `components/post-speech/speech-chrome.ts`; texto falado em `utils/speech-text.ts`; runtime em `public/speech.js` (lazy). Não recriar player com hook React.
- Math de reading progress fica em `utils/reading-progress.ts`. Ids de heading do markdown ficam no helper puro ao lado de `Markdown`.
- Testes unitários miram utils/hooks, não o JSX.
- Novos componentes client devem justificar a fronteira na review ou na spec relacionada.
- Não reintroduzir wrappers React (`TrackedLink`, `lib/analytics` client) para o que `site.js` já cobre.
