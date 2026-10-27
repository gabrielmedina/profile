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

1. **Logo oficial quando a tecnologia existe.** Se o post trata de uma lib, linguagem, API ou produto com branding público (TypeScript, React, etc.), a marca na capa vem do **kit/branding oficial** (ex.: [TypeScript Branding](https://www.typescriptlang.org/branding/)). Não redesenhar, não distorcer o desenho das letras, não fundir a logo no “logo do site”.
2. **Compor sobre o nosso padrão — sem quadrado-sobre-quadrado.** Mantém-se a composição da série (fundo + cartões / linha / âncora). A marca entra por **composição** no cartão iluminado. Se o container já é o nosso quadrado/cartão de vidro, **não** empilhar a logo com fundo próprio (o quadrado azul do TypeScript, o escudo de outra marca, etc.). Preferir, nesta ordem:
   1. **só a escrita / monograma** do asset oficial (letras “TS”, wordmark, glyph cutout) em branco ou tom único sobre o cartão;
   2. **logo completa com tratamento** — preto e branco, monocromático ou overlay suave — para a marca não brigar com o vidro;
   3. só então a marca colorida full-bleed, e **somente** se ela for a âncora sozinha (sem nosso quadrado por baixo).
3. **Fundo estável entre capas.** O fundo das capas usa um tom fixo da série, ligeiramente distinto do `--color-background` dark do site (`#16161b`), para a capa não “sumir” no chrome — mas **não** varia de post para post. Cor-alvo da série: **`#1a1d24`** (slate escuro). Evitar teal, navy saturado, roxo ou gradientes de marca diferentes a cada geração. Variação permitida: luz/vinheta da âncora; o campo de fundo permanece o mesmo.
4. **Sem tipografia inventada da marca.** Nada de monograma “aproximado”, wordmark recriado ou ícone “inspirado”. Ou é o asset oficial (letras/logo), ou a capa fica só com o padrão abstrato da série (estrela / cartão), sem fingir a marca.
5. **Prompt / checklist de geração.** Ao pedir ou montar uma capa:
   - referenciar 1–2 capas existentes da série;
   - fixar o hex do fundo (`#1a1d24`);
   - se houver marca: baixar o asset oficial; deixar a âncora limpa no prompt da base; compor **letras/wordmark** (ou logo filtrada) no cartão — sem placa/fundo extra atrás da escrita; respeitar a região da marca oficial (ex.: monograma TS na faixa inferior) com escala menor e mais padding quando o nosso quadrado for maior;
   - exportar o par WebP (corpo) + JPEG leve (OG) em ~1200×674 (ou equivalente 16:9 da série), ≤ ~100 KB no social.

## Consequências

- Novos posts entram no repo já com par jpg + webp (ou só webp leve se o jpg for desnecessário).
- CI / checklist humano: rejeitar PNG de capa > ~100 KB no frontmatter.
- Cover figure opcional no chrome do artigo (fora do markdown) continua no backlog; quando existir, usa o mesmo `post.image` + `next/image`.
- Posts sobre tecnologia/lib existente preferem marca oficial composta (escrita/monograma ou logo filtrada quando o container é nosso); o fundo das capas da série permanece `#1a1d24` salvo decisão explícita de mudar a série inteira.
