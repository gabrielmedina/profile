# 005 — Monetização

**Status:** aceita

## Contexto

O site é um perfil com posts. Três ideias de receita foram consideradas: anúncio, um agradecimento no estilo “me paga um café”, e trabalho pago de mentoria ou consultoria. O texto `acompanhar-devs-no-dia-a-dia` já descreve o espírito do acompanhamento. O catálogo é curto e o tráfego ainda não justifica rede de anúncio. O site sai como HTML, com um script pequeno, sem SDK de terceiro.

Quem oferece o trabalho é Senior Front-end Engineer, com 16 anos de experiência, especializado em arquitetura, padronização e entregas que acertam. O percurso público passa por Grupo Boticário e Grupo SBF. Não há firma nem certificado. O que se vende é um trabalho para o front-end que a IA está escrevendo.

Empresas estão gerando a interface só com IA. Quem escreve, muitas vezes, é fullstack ou back-end. O código sai rápido, fica anêmico, falha com facilidade, e custa manter e escalar.

## Decisão

Café e anúncio continuam fora do produto. A página `/consultoria` publica um único trabalho, sem preço. A navegação ganha o item Consultoria, ao lado de Home e Posts. O rodapé também aponta para a página.

O trabalho tem três partes:

1. **Padrões.** Como o front-end deve ser escrito: arquitetura, convenção, e o que a próxima geração da IA precisa respeitar.
2. **O que a IA já entregou.** Revisão das features feitas com IA: o que fica, o que sai, e o que precisa de outra volta.
3. **Observabilidade.** O time passa a ver a falha quando ela acontece, e se o padrão segurou.

Não há preço publicado. O primeiro passo é entender o problema. O entregável seguinte é um plano de evolução e de melhorias. O valor sai nessa conversa.

### Contato

WhatsApp `+55 67 99609-6006` (`wa.me/5567996096006`). A mensagem pronta:

```text
Olá, Gabriel. Vim pelo site.
O front-end daqui está sendo feito com IA.
O que mais dói hoje:
```

Sem widget, popup ou script de agenda. O link é uma âncora para o WhatsApp. A mensagem pronta vive só no `href`. A página mostra o botão e o número, e não o texto da mensagem.

### Páginas

O texto vive em `src/features/consulting/content.ts`. A URL do WhatsApp é função pura ao lado do componente. A rota é fina: metadata, JSON-LD, page view, render.

**`/consultoria`** é a única página, na coluna de 1200px. O `<h1>` nomeia a dor: o front-end que a IA escreveu está difícil de manter. Em seguida, para quem é, o que acontece com o código, e a prova curta (16 anos, Grupo Boticário, Grupo SBF). “O trabalho” lista padrões, revisão e observabilidade. “Como começa” diz que o preço fica em aberto e termina no WhatsApp.

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
