# Profile

Site pessoal do Gabriel Medina. Perfil carregado do GitHub e posts escritos em Markdown.

## Stack

- Next.js 16 com App Router, Cache Components e Partial Prefetching
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

Para enviar eventos ao Amplitude em produção, defina `NEXT_PUBLIC_AMPLITUDE_KEY`. O arquivo `.env.example` lista a variável. Sem a chave, os eventos aparecem só no console durante o desenvolvimento.

## Estrutura

```text
src/app          rotas, metadata e layout
src/features     perfil e posts: dados, tipos e UI
src/components   navegação, tema, markdown e analytics
src/lib          helpers sem dependência de UI
src/styles       tokens, reset e tema
content/posts    markdown publicado
```

`src/app` só compõe a página. A leitura de arquivos e da API do GitHub fica em módulos `server-only`, com `use cache` e um `cacheLife` explícito. Componentes de cliente existem só onde há interação: tema, links com evento e visualização de página.

Posts novos são um arquivo `.md` em `content/posts`. O modelo é `content/posts/ia-acelera-o-desenvolvimento.md`: o slug do frontmatter precisa ser igual ao nome do arquivo, em minúsculas e com hífens. `image` é opcional; sem ela, o Open Graph usa `/og.png`.
