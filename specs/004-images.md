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

### Geração de capas (padrão visual)

Capas de post seguem o mesmo sistema visual da série (plano atmosférico + cartões de vidro / âncora iluminada). A geração **não** inventa identidade de marca alheia nem troca a atmosfera a cada artigo.

1. **Logo oficial quando a tecnologia existe.** Se o post trata de uma lib, linguagem, API ou produto com branding público (TypeScript, React, etc.), a marca na capa é a **logo oficial** do projeto — baixada do kit/branding oficial (ex.: [TypeScript Branding](https://www.typescriptlang.org/branding/)). Não redesenhar, não distorcer, não recolorir o símbolo, não fundir a logo no “logo do site”.
2. **Compor sobre o nosso padrão.** Mantém-se a composição da série (fundo + cartões / linha / âncora). A logo oficial entra como elemento nítido no cartão ou âncora iluminada — tipicamente por **composição** (asset oficial sobre a base), não por reinterpretar a marca num gerador de imagem.
3. **Fundo estável entre capas.** O fundo das capas usa um tom fixo da série, ligeiramente distinto do `--color-background` dark do site (`#16161b`), para a capa não “sumir” no chrome — mas **não** varia de post para post. Cor-alvo da série: **`#1a1d24`** (slate escuro). Evitar teal, navy saturado, roxo ou gradientes de marca diferentes a cada geração. Variação permitida: luz/vinheta da âncora; o campo de fundo permanece o mesmo.
4. **Sem tipografia inventada da marca.** Nada de monograma “aproximado”, wordmark recriado ou ícone “inspirado”. Ou é o asset oficial, ou a capa fica só com o padrão abstrato da série (estrela / cartão), sem fingir a logo.
5. **Prompt / checklist de geração.** Ao pedir ou montar uma capa:
   - referenciar 1–2 capas existentes da série;
   - fixar o hex do fundo (`#1a1d24`);
   - se houver marca: baixar o asset oficial e compor; no prompt da base, deixar a área da âncora limpa (sem letras falsas);
   - exportar o par WebP (corpo) + JPEG leve (OG) em ~1200×674 (ou equivalente 16:9 da série), ≤ ~100 KB no social.

## Consequências

- Novos posts entram no repo já com par jpg + webp (ou só webp leve se o jpg for desnecessário).
- CI / checklist humano: rejeitar PNG de capa > ~100 KB no frontmatter.
- Cover figure opcional no chrome do artigo (fora do markdown) continua no backlog; quando existir, usa o mesmo `post.image` + `next/image`.
- Posts sobre tecnologia/lib existente preferem capa com logo oficial composta; o fundo das capas da série permanece `#1a1d24` salvo decisão explícita de mudar a série inteira.
