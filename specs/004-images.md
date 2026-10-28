# 004 — Imagens leves e `next/image`

**Status:** aceita

## Contexto

Imagens de capa e OG pesadas degradam LCP e o preview social. O Next já está configurado para AVIF/WebP; o conteúdo precisa seguir a mesma disciplina.

## Decisão

### Pipeline

1. **Corpo do post (Markdown):** preferir **WebP** (ou AVIF) local em `/imgs/posts/…`.
2. **Frontmatter `image` (OG / Twitter / JSON-LD):** JPEG ou WebP leve, tipicamente o par `.jpg` da capa. Alvo: **≤ ~100 KB** por asset social.
3. **Render no app:** sempre `next/image` quando width/height são conhecidos (medidos em `services/image-size.ts` no load do post).
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

### Geração de capas (família visual, composição por tema)

Capas compartilham uma **família** minimalista — não um template único. Fundo, material e tipografia de marca se repetem; **formas e ligações mudam com o post**.

#### Família (estável)

- Fundo: **`#1a1d24`** (slate escuro, distinto do `--color-background` dark `#16161b`). Não variar o campo de fundo entre posts.
- Material: vidro fosco / nós luminosos / acento mint-teal suave. Sem roxo, sem glow de marca alheia, sem clutter.
- Export: ~1200×674 (16:9), WebP no corpo + JPEG leve no OG (≤ ~100 KB social).
- A página `/consultoria` usa a mesma família numa faixa mais baixa (1200×281). A altura do 16:9 fica grande demais nessa página. Ver `005`.

#### Composição (varia por post)

1. **Ler o tema antes de desenhar.** A geometria deve ecoar a ideia do artigo — não repetir “três cartões + linha + estrela” por padrão.
2. **Formas e ligações com intenção.** Exemplos (não checklist obrigatória):
   - sequência / migração → trilha, arco, antes→depois;
   - monorepo / fronteiras → hub + pacotes, anéis de limite;
   - aceleração → trajetória diagonal, nó à frente;
   - spec-driven / decisão escrita → pilha de specs (convenção, decisão, aceite) com IAs satélite perto;
   - mentoria → de contorno guiado a nó autônomo;
   - design system / breaking → grade de peças, uma com fissura vs evolução;
   - escolha técnica (ex.: Context vs Query) → bifuração ou um caminho aceso e outros apagados.
3. **Evitar série clone.** Se duas capas consecutivas usam a mesma estrutura (fila horizontal de cards + estrela), redesenhar uma delas.
4. **Minimalismo.** Poucos elementos, um foco, sem texto inventado, sem ilustração narrativa densa.

#### Logos oficiais

1. Se o post trata de lib/linguagem/API/produto com branding público, usar asset do **kit oficial** (ex.: [TypeScript Branding](https://www.typescriptlang.org/branding/)).
2. Não redesenhar, não distorcer letras, não fundir no logo do site.
3. Com o nosso container (cartão/nó de vidro): **não** empilhar logo com fundo próprio (quadrado azul TS, escudo, etc.). Preferir:
   1. escrita / monograma / glyph cutout em branco ou tom único, **centralizado**;
   2. logo completa em P&B / monocromático / overlay;
   3. marca colorida full-bleed só se for a âncora sozinha (sem nosso quadrado por baixo).
4. Sem monograma “aproximado”: ou asset oficial, ou abstrato puro.

#### Checklist de geração

- Definir em uma frase a metáfora geométrica do post.
- Fixar fundo `#1a1d24`; comparar com 1–2 capas vizinhas e mudar a estrutura se estiver clone.
- Se houver marca: baixar oficial → compor letras/filtro no foco → centralizar com padding generoso.
- Atualizar o `alt` do Markdown para descrever a composição real (não um template genérico).

## Consequências

- Novos posts entram no repo já com par jpg + webp (ou só webp leve se o jpg for desnecessário).
- CI / checklist humano: rejeitar PNG de capa > ~100 KB no frontmatter.
- Cover figure opcional no chrome do artigo (fora do markdown) continua no backlog; quando existir, usa o mesmo `post.image` + `next/image`.
- Capas da série compartilham atmosfera (`#1a1d24` + minimalismo); a composição é escolhida pelo tema. Tecnologia/lib existente leva marca oficial composta (escrita ou filtrada quando o container é nosso).
