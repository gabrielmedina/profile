# Profile

Site pessoal do Gabriel Medina. Perfil carregado do GitHub e posts escritos em Markdown.

## Stack

- Next.js 16 com App Router e Cache Components
- React 19
- TypeScript 6, que ainda é a versão com API de compilador usada pelo ESLint do Next.js
- ESLint flat config (`eslint-config-next`) e Prettier

## Requisitos

- Node.js 24.x

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
npm run format
```

`npm run dev` sobe o app em [http://localhost:3000](http://localhost:3000).

Para enviar eventos ao Amplitude em produção, defina `NEXT_PUBLIC_AMPLITUDE_KEY`. O arquivo `.env.example` lista a variável. Sem a chave, ou fora de produção, os eventos aparecem só no console. O envio usa a HTTP API, sem o SDK do Amplitude no navegador.

## Estrutura

```text
src/app          rotas, metadata e layout
src/features     perfil e posts: dados, tipos e UI
src/components   navegação, tema, markdown e analytics
src/lib          helpers sem dependência de UI
src/styles       tokens, reset e tema
content/posts    markdown publicado
specs/           decisões (Spec Driven Development) e backlog
```

`src/app` só compõe a página. A leitura de arquivos e da API do GitHub fica em módulos `server-only`, com `use cache` e um `cacheLife` explícito. A interface sai como HTML do servidor. Tema, página atual, analytics e copiar link ficam num script pequeno, sem o runtime do React. A leitura em voz alta só baixa JavaScript quando alguém pede para ouvir. Links internos são âncoras nativas; o navegador faz prefetch do HTML com Speculation Rules.

Decisões de arquitetura, fronteiras de componente, SEO de posts e política de imagens estão em [`specs/`](./specs/README.md). O backlog de refatoração vive em [`specs/backlog.md`](./specs/backlog.md).

Posts novos são um arquivo `.md` em `content/posts`. O modelo é `content/posts/ia-acelera-o-desenvolvimento.md`: o slug do frontmatter precisa ser igual ao nome do arquivo, em minúsculas e com hífens. `image` é opcional (JPEG/WebP leve para OG); sem ela, o Open Graph usa `/og.png`. No corpo, preferir WebP e `next/image` (ver [`specs/004-images.md`](./specs/004-images.md)).
