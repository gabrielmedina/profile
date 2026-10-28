# 005 — Monetização

**Status:** aceita

## Contexto

O site é um perfil com posts. Três ideias de receita foram consideradas: anúncio, um agradecimento no estilo “me paga um café”, e trabalho pago de mentoria ou consultoria. O texto `acompanhar-devs-no-dia-a-dia` já descreve o espírito do acompanhamento. O catálogo é curto e o tráfego ainda não justifica rede de anúncio. O site sai como HTML, com um script pequeno, sem SDK de terceiro.

Quem oferece o trabalho é Senior Front-end Engineer, com 16 anos de experiência, especializado em arquitetura, padronização e entregas que acertam. O percurso público passa por Grupo Boticário e Grupo SBF. Não há firma nem certificado. O que se vende é um trabalho para o front-end que a IA está escrevendo.

Empresas estão gerando a interface com IA. A entrega acelera. O trabalho é deixar esse código compreensível, observável e pronto para a próxima feature, sem apontar o ofício de quem escreveu.

## Decisão

Café e anúncio continuam fora do produto. A página `/consultoria` publica um único trabalho, sem preço. A navegação ganha o item Consultoria, ao lado de Home e Posts. O rodapé também aponta para a página.

O trabalho não é uma lista de passos. É o entendimento do que já foi gerado e dos gargalos, a proposta de padrões e melhorias, e features que saem com observabilidade, padronizadas, operando com fluidez. O front-end fica otimizado e bem estruturado, uma base para as próximas features.

Não há preço publicado. O valor sai depois de entender o problema e de escrever o plano.

### Contato

WhatsApp `+55 67 99609-6006` (`wa.me/5567996096006`). A mensagem pronta:

```text
Olá, Gabriel. Vim pelo site.
Quero melhorar o front-end do projeto.
O que a IA já gerou:
```

Sem widget, popup ou script de agenda. O link é uma âncora para o WhatsApp. A mensagem pronta vive só no `href`. A página mostra só o botão, sem o número e sem o texto da mensagem.

### Páginas

O texto vive em `src/features/consulting/content.ts`. A URL do WhatsApp é função pura ao lado do componente. A rota é fina: metadata, JSON-LD, page view, render.

**`/consultoria`** é a única página e usa o mesmo layout de um post (`post-article`): invólucro de 1200px, `<h1>` e descrição no mesmo tamanho e na mesma cor, corpo centralizado em 740px com os mesmos parágrafos e `h2`. O `<h1>` diz o resultado: um front-end com IA, pronto para as próximas features. A descrição, em primary, diz para quem é. A capa entra no corpo, no mesmo lugar da imagem de um post, numa faixa mais baixa (1200×281): barras soltas seguem por uma linha até um traço mint. WebP na página, JPEG no OG. O texto traz o que o trabalho faz e a prova curta (16 anos, Grupo Boticário, Grupo SBF). As frases que carregam a oferta ficam em `<strong>`, na cor primary, como nos posts. “O trabalho” explica o entendimento e o que fica no projeto, sem numerar etapas. O fechamento é um banner na largura da capa, campo `#1a1d24`: a pergunta “Quer melhorar o front-end do seu projeto?” e o botão de WhatsApp, sem o número.

As rotas antigas redirecionam para `/consultoria`: `/consultoria/individual`, `/consultoria/empresarial`, `/consultoria/leitura-de-carreira` e `/consultoria/para-um-time`.

Sitemap inclui só `/consultoria`. JSON-LD é `WebPage` + `BreadcrumbList` + `Service`, sem `Offer`. Os posts seguem sem oferta.

### Café e anúncio

Ficam para outra onda.

- **Café.** Uma frase depois do artigo, antes dos relacionados, com link para fora (Pix). Sem botão flutuante e sem SDK. Só nasce com chave ou link reais.
- **Anúncio.** Só quando o tráfego pagar o custo de um script de terceiro e de um banner de consentimento. Um bloco único, abaixo do artigo, numa rede que não rastreia o leitor. Fora do corpo do texto.

## Consequências

- Preço, quando existir, altera `content.ts` e esta spec no mesmo passo. Até lá a página não publica valor.
- A página não ganha script de anúncio, widget de doação nem formulário que substitua o WhatsApp.
- Café e anúncio continuam `depois` no backlog.
