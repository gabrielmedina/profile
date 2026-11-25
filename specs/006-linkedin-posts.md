# 006 — Posts curtos (LinkedIn-style) e Imagens Interativas

**Status:** em proposta

## Contexto

O foco da comunicação do site está mudando para o LinkedIn. Isso exige um formato de postagem mais direto, curto e com forte apelo visual, utilizando imagens que respeitem as proporções do LinkedIn e que possam ser animadas ou interativas.

## Decisão

### Novo tipo de post: `linkedin`

Introduziremos uma distinção no frontmatter para identificar posts que seguem o formato LinkedIn.

1. **Frontmatter**:
   - `type: "linkedin"` (opcional, padrão é "article")
   - `linkedin_link: string` (opcional, link para o post original no LinkedIn)

O campo `linkedin_image` foi descontinuado em favor da inclusão direta no conteúdo. Para a imagem social (Open Graph), deve-se continuar usando o campo padrão `image`.

2. **Layout**:
   - Posts do tipo `linkedin` mantêm o layout padrão do site para consistência (header, largura do texto e guia lateral).
   - A `linkedin_image` é exibida com prioridade no topo, centralizada e com foco visual (max-width: 600px).
   - O guia "Neste artigo" (TOC) é mantido para facilitar a navegação em conteúdos focados.
   - O tempo de leitura pode ser omitido se o post for extremamente curto (< 100 palavras).

### Imagens no Conteúdo

As imagens (estáticas, GIFs ou vídeos) agora são inseridas diretamente no corpo do post (Markdown). Não há mais o conceito de "capa" separada do conteúdo. 

- **Imagens Padrão**: Use a sintaxe Markdown `![Alt](/caminho)`. O site aplicará automaticamente o estilo visual (bordas arredondadas, sombra e comportamento de largura) para todas as imagens locais.
- **Mídia Avançada (Vídeos/GIFs)**: Use a tag `<post-media>` para maior controle ou para arquivos que precisam de comportamento de vídeo (autoplay, loop):

```html
<post-media src="/imgs/posts/my-anim.mp4" alt="Descrição"></post-media>
```

Esta abordagem remove o "hardcode" de LinkedIn do código, permitindo que qualquer post utilize esse estilo visual moderno e focado.

### Proporções LinkedIn

As imagens devem seguir uma das proporções padrão do LinkedIn:
- **Square (1:1)**: 1200x1200px.
- **Portrait (4:5)**: 1080x1350px.
- **Landscape (1.91:1)**: 1200x627px.

O foco deve ser **Portrait** ou **Square**, que ocupam mais espaço vertical no feed mobile.

## Consequências

- O parser de posts em `src/features/posts/services/posts.ts` deve validar o novo campo `type`.
- O componente `PostArticle` deve alternar o layout baseado no `type`.
- Precisamos de um novo componente `LinkedInImage` que lide com o aspecto interativo/animado.
