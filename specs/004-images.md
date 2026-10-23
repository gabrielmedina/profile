# 004 — Imagens leves e `next/image`

**Status:** aceita

## Contexto

Imagens de capa e OG pesadas degradam LCP e o preview social. O Next já está configurado para AVIF/WebP; o conteúdo precisa seguir a mesma disciplina.

## Decisão

### Pipeline

1. **Corpo do post (Markdown):** preferir **WebP** (ou AVIF) local em `/imgs/posts/…`.
2. **Frontmatter `image` (OG / Twitter / JSON-LD):** JPEG ou WebP leve, tipicamente o par `.jpg` da capa. Alvo: **≤ ~100 KB** por asset social.
3. **Render no app:** sempre `next/image` quando width/height são conhecidos (medidos em `image-size.ts` no load do post).
4. **Fallback `<img>`:** só para remoto ou arquivo sem dimensão mensurável — nunca como padrão para assets locais versionados.
5. **Primeira imagem do markdown:** `priority` para LCP.
6. **`sizes`:** conteúdo de artigo usa `(min-width: 1200px) 1200px, 100vw` (ou valor equivalente se o layout mudar).

### Configuração Next

Em `next.config.ts`:

- `images.formats: ['image/avif', 'image/webp']`
- `remotePatterns` só para hosts necessários (hoje: `avatars.githubusercontent.com`)

### Convenção de arquivos

Para um post `meu-slug`:

| Uso         | Arquivo típico                                   |
| ----------- | ------------------------------------------------ |
| Corpo       | `/imgs/posts/meu-slug.webp`                      |
| Social / OG | `/imgs/posts/meu-slug.jpg`                       |
| Proibido    | PNG multi‑MB, assets > ~300 KB sem justificativa |

O nome do arquivo no frontmatter e no markdown não precisa coincidir, mas o frontmatter **não** deve apontar para um PNG pesado se existir JPEG/WebP equivalente.

### Dimensões

- Tamanhos lidos no servidor e anexados em `post.images`.
- Sem width/height conhecidos → não inventar; usar fallback documentado ou corrigir o asset.

## Consequências

- Novos posts entram no repo já com par jpg + webp (ou só webp leve se o jpg for desnecessário).
- CI / checklist humano: rejeitar PNG de capa > ~100 KB no frontmatter.
- Cover figure opcional no chrome do artigo (fora do markdown) continua no backlog; quando existir, usa o mesmo `post.image` + `next/image`.
