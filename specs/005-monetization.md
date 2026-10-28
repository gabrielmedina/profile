# 005 — Monetização

**Status:** aceita

## Contexto

O site é um perfil com posts. Três ideias de receita foram consideradas: anúncio, um agradecimento no estilo “me paga um café”, e trabalho pago de mentoria ou consultoria. O texto `acompanhar-devs-no-dia-a-dia` já descreve o espírito do acompanhamento. O catálogo é curto e o tráfego ainda não justifica rede de anúncio. O site sai como HTML, com um script pequeno, sem SDK de terceiro.

Quem oferece o trabalho é senior front-end engineer, com mais de 16 anos de web, mais de 8 com React, passagem pelo Grupo Boticário em plataformas de e-commerce e atuação no Grupo SBF como referência técnica entre times. Não há firma nem certificado de mentor. O que se vende é esse percurso, em dois formatos com compradores diferentes.

## Decisão

Café e anúncio continuam fora do produto. A página `/consultoria` publica os dois formatos abaixo, com preço e WhatsApp. A navegação ganha o item Consultoria, ao lado de Home e Posts. O rodapé também aponta para a página.

### Leitura de carreira

Para dev júnior ou pleno, pagando do próprio bolso. O entregável é um plano, não companhia no dia a dia.

1. A pessoa conta o momento, o que trava, e manda um material real: projeto, pull request, ou uma decisão que está na mão dela.
2. Um encontro de 75 minutos confirma onde ela está, olha o material e escolhe um próximo passo que cabe nas semanas seguintes.
3. Em até três dias sai o plano escrito: onde está, o que trava, uma meta, três passos, e como perceber que andou.

Preços, no Pix, pagos antes de marcar:

| Quem                     | Valor  |
| ------------------------ | ------ |
| Júnior, leitura e plano  | R$ 320 |
| Pleno, leitura e plano   | R$ 520 |
| Júnior, quatro encontros | R$ 640 |
| Pleno, quatro encontros  | R$ 960 |

Os quatro encontros são semanais, de 45 minutos, e só existem para quem já tem o plano. Dá para reagendar uma vez, avisando com um dia. Teto interno: quatro leituras por mês.

### Consultoria para uma dor

Para um time de engenharia. A empresa chega com uma dor já dita. O entregável é a sessão com o grupo e um plano de 30 e 60 dias. Quem executa é o time.

1. Uma página de combinado: a dor em uma frase, quem entra na sala, dois exemplos concretos enviados com cinco dias de antecedência, e o que fica de fora.
2. Quarenta e cinco minutos com quem patrocina, para a restrição e para o que “melhor” significa.
3. Sessão de 2h30 com 6 a 12 pessoas. Corrige-se o entendimento, olham-se os exemplos e rascunham-se três movimentos, com dono do lado deles. Abaixo de quatro pessoas o formato é a leitura de carreira. Acima de doze vira palestra, e este contrato não cobre palestra.
4. Em até cinco dias úteis, o plano: a dor no dia a dia, a causa, o que não mudar agora, as ações com ordem e dono, e os sinais de que funcionou. Uma call de 30 minutos entrega o texto.

Preços:

| Escopo                                | Valor     |
| ------------------------------------- | --------- |
| Um time, uma dor                      | R$ 8.000  |
| A mesma dor em mais de um time        | R$ 12.000 |
| Retorno de 90 minutos, 30 dias depois | R$ 2.500  |

Metade ao fechar a data, metade na entrega do plano. Uma dor por contrato. Teto interno: uma consultoria de empresa por mês.

Empresa em geral pede nota. Consultoria de tecnologia costuma não caber no MEI. Antes do primeiro contrato corporativo, um contador confirma se o caminho é microempresa. A página não fala de imposto. O combinado de nota, se precisar, acontece na conversa.

### Contato

WhatsApp `+55 67 99609-6006` (`wa.me/5567996096006`). Cada formato abre com a mensagem pronta. A pessoa completa antes de enviar.

Leitura de carreira:

```text
Olá, Gabriel. Vim pelo site e quero uma leitura de carreira.
Sou júnior ou pleno:
Meu momento hoje:
```

Consultoria para um time:

```text
Olá, Gabriel. Vim pelo site e quero uma consultoria para o time.
A dor que queremos olhar:
Quantas pessoas entrariam na sessão:
```

Sem widget, popup ou script de agenda. O link é uma âncora para o WhatsApp.

### Página `/consultoria`

Rota fina em `src/app/consultoria/page.tsx`: metadata, JSON-LD, page view, render do componente. O texto e os preços vivem em `src/features/consulting/content.ts`. A URL do WhatsApp é função pura ao lado do componente.

A página tem um `<h1>` e esta ordem:

1. Abertura com quem é: senior front-end engineer, 16 anos de web, 8 de React, Grupo Boticário, Grupo SBF.
2. Experiência: arquitetura de front-end, design systems, microfrontends, e as duas empresas acima.
3. O que entrega: os dois formatos, com o passo a passo, os preços e o WhatsApp de cada um. A mensagem pronta aparece na página.
4. O tamanho do trabalho: o plano é o entregável da leitura; na consultoria o time executa; cada contrato olha uma dor.

Sitemap inclui `/consultoria`. JSON-LD é `WebPage` + `BreadcrumbList` + `Service`/`Offer` em BRL para cada preço. O post `acompanhar-devs-no-dia-a-dia` fecha com uma frase apontando para a página. Os outros posts seguem sem oferta.

### Café e anúncio

Ficam para outra onda.

- **Café.** Uma frase depois do artigo, antes dos relacionados, com link para fora (Pix). Sem botão flutuante e sem SDK. Só nasce com chave ou link reais.
- **Anúncio.** Só quando o tráfego pagar o custo de um script de terceiro e de um banner de consentimento. Um bloco único, abaixo do artigo, numa rede que não rastreia o leitor. Fora do corpo do texto.

## Consequências

- Preço novo altera `content.ts` e esta spec no mesmo passo.
- A página não ganha script de anúncio, widget de doação nem formulário que substitua o WhatsApp.
- O ciclo de quatro encontros não é vendido sem a leitura. A consultoria não inclui implementação nem gestão do time.
- Café e anúncio continuam `depois` no backlog.
