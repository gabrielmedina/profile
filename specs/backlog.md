# Backlog de refatoração

Itens descobertos na rodada inicial de SDD. Status: `feito` | `em progresso` | `próximo` | `depois`.

## Onda 1 (esta PR)

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
| Feed RSS usa `splitKeywords`                                  | 003             | feito  |
| Trocar capa OG `referencia-tecnica.png` (1.2 MB) por JPG leve | 004             | feito  |

## Próximas ondas

| Item                                                                 | Spec     | Status  | Notas                                                      |
| -------------------------------------------------------------------- | -------- | ------- | ---------------------------------------------------------- |
| Extrair `usePostSpeech` de `post-speech.tsx`                         | 002      | próximo | Maior ganho de testabilidade; UI fica só com controles     |
| Zod: `keys` → `keywords: string[]` na borda                          | 001, 003 | próximo | Páginas deixam de chamar `splitKeywords`                   |
| Campo `updated` no frontmatter → `dateModified`                      | 003      | próximo | Hoje modified = published                                  |
| Cover figure opcional no chrome do artigo                            | 003, 004 | depois  | Usar `post.image` + `next/image`, não só a 1ª imagem do MD |
| Keywords como links / página de tag                                  | 003      | depois  | Só se houver navegação por assunto                         |
| `aria-label` pt-BR no theme switcher                                 | —        | próximo | Títulos hoje em inglês                                     |
| Enclosure/imagem no RSS                                              | 003, 004 | depois  | Usar `post.image`                                          |
| Testes unitários de `related`, `speech-text`, `image-size`, metadata | 002      | próximo | Ancorar SDD com regressão                                  |
| Política / sanitizer se `rehype-raw` sair de conteúdo só do repo     | 003      | depois  | Documentar trust model                                     |
| Cache helper de related posts por slug                               | 001      | depois  | Micro-otimização                                           |
| Placeholder blur em capas LCP                                        | 004      | depois  | Opcional                                                   |
| Checagem de tamanho de asset no CI                                   | 004      | depois  | Falhar build se OG > limiar                                |

## Critério para fechar um item

1. Código alinhado à spec citada (ou spec atualizada no mesmo PR).
2. `npm run typecheck` e `npm run lint` verdes.
3. Sem misturar server/client em barrel novo.
