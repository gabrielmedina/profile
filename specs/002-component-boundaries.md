# 002 — Fronteira apresentação × domínio

**Status:** aceita

## Contexto

Componentes de UI acumulam regras (clipboard, speech synthesis, progresso de leitura, parsing de markdown). Isso dificulta teste, reuso e leitura. A refatoração exige que apresentação fique fina.

## Decisão

### O que pode viver num componente de apresentação

- Markup semântico e classes de estilo
- Composição de outros componentes
- Props tipadas já resolvidas (dados prontos)
- Wiring mínimo de eventos para hooks/utils (`onClick={() => copyLink()}` onde `copyLink` vem de um hook)

### O que deve viver fora

| Tipo                              | Onde                                                |
| --------------------------------- | --------------------------------------------------- |
| Parsing, scoring, formatação pura | `features/<d>/*.ts` ou `lib/*.ts`                   |
| Validação de conteúdo / payloads  | Zod na borda (`posts.ts`, `get-profile.ts`)         |
| Estado + efeitos de browser       | `hooks/use-*.ts` no domínio ou componente           |
| Tracking de analytics             | módulo de analytics; wrappers finos (`TrackedLink`) |
| Leitura de FS / rede              | módulos `server-only`                               |

### Regras práticas

1. Se um `.tsx` de apresentação passa de ~150–200 linhas por lógica (não por markup), extrair.
2. `'use client'` no menor pedaço possível. Lista de posts não deve virar client só por um `track()` no clique — usar um wrapper (`TrackedLink`).
3. Ícones SVG inline podem ficar no componente de UI; a lógica ao redor não.
4. Páginas em `app/` recebem dados tipados e renderizam features; não calculam related posts “na mão” além de chamar a função do domínio.

## Consequências

- Extrações prioritárias: `post-speech` → hook; clipboard → `lib`/`features`; math de reading progress → util puro; ids de heading markdown → util.
- Testes unitários miram utils/hooks, não o JSX.
- Novos componentes client devem justificar a fronteira na review ou na spec relacionada.
