---
title: 'BFF: o que melhora no front — e o que custa manter'
description: 'Backend for Frontend não é só mais uma API. Vantagens, desvantagens e o que realmente muda para quem escreve a interface.'
keys: 'Front-end, Software Engineering, React'
image: /imgs/posts/bff-vantagens-e-desvantagens.jpg
slug: bff-vantagens-e-desvantagens
lang: pt-BR
date: '2026-10-29'
---

![Capa: três nós de serviço à esquerda ligam a um cartão de vidro central (BFF); uma linha segue até a tela do cliente à direita.](/imgs/posts/bff-vantagens-e-desvantagens.webp)

Quando a tela precisa de três serviços, dois formatos diferentes e um token que não pode vazar no browser, o front costuma virar o orquestrador. Ele agrega, traduz, esconde segredo e ainda precisa pintar a UI.

**BFF** — Backend for Frontend — é o padrão de colocar uma API dedicada àquele cliente (web, app, backoffice) entre a interface e os serviços de domínio. O front deixa de falar com o grafo inteiro. Fala com um contrato feito para a tela.

Na minha opinião, o valor não está em “ter mais um microserviço”. Está em **tirar do browser o trabalho que não é de interface**.

## O que é um BFF, na prática

Sam Newman descreveu o BFF como uma API por experiência de usuário: o time do cliente molda o backend que a tela consome. Não é um gateway genérico para todo mundo. É um adaptador com dono.

No dia a dia, isso costuma significar:

- um endpoint (ou poucos) alinhado ao fluxo da página;
- agregação de respostas de vários serviços;
- shape de JSON pensado para o componente — sem o front mapear DTO de domínio em cascata;
- autenticação, autorização e segredos no servidor;
- regras de apresentação que não pertencem ao domínio core (flags de UI, labels compostos, paginação “da tela”).

O BFF não substitui o domínio. Ele **protege a superfície do cliente** e deixa o domínio evoluir sem arrastar o browser junto.

## Principais vantagens

### 1. Menos round-trips no browser

Sem BFF, a home pode disparar N fetches: perfil, carrinho, recomendações, feature flags. Com BFF, a página pede o que a view precisa — uma vez ou em poucos contratos estáveis. Menos waterfall, menos coordenação de loading no React, menos chance de a tela “montar pela metade”.

### 2. Contrato moldado para a UI

O front para de adaptar `UserDto`, `OrderProjection` e `CatalogItemV3` em cada feature. O BFF devolve o modelo da tela: campos nomeados como o design system usa, opcionais já resolvidos, listas já filtradas. O componente lê. Não traduz.

### 3. Segredo e credencial fora do cliente

Tokens de serviço a serviço, chaves de terceiros, regras de autorização finas: ficam no servidor. O browser recebe só o que a sessão daquele cliente pode ver. Isso não é detalhe de segurança “depois”; é o desenho.

### 4. Evolução do backend sem quebrar a tela

O serviço de domínio muda o payload. O BFF absorve o drift e mantém o contrato do front. O time de UI deixa de acompanhar cada breaking change de API interna. O acoplamento muda de lugar: front ↔ BFF, não front ↔ N serviços.

### 5. Time de front com alavanca de verdade

Quando o BFF é do time do cliente (ou próximo dele), a conversa sobre “preciso desse campo agregado” deixa de ser ticket eterno para outro domínio. Quem sente a dor da tela ajusta a borda. Isso acelera entrega sem pedir ao domínio core que vire CMS da UI.

### 6. Superfície menor para o client-side

Menos SDKs, menos clients HTTP, menos lógica de merge e retry no bundle. O JavaScript do browser volta a cuidar de interação, estado de UI e feedback — não de orquestração de integração.

## Desvantagens e custos reais

### 1. Mais um serviço para operar

Deploy, observabilidade, versionamento, on-call. O BFF não é “só um arquivo de route handler”. Em escala, é superfície de falha: se ele cai, a experiência daquele cliente cai — mesmo com os domínios saudáveis.

### 2. Risco de virar God API

Sem disciplina, o BFF acumula regra de negócio que deveria estar no domínio. Vira segundo core. Aí você paga o custo de dois backends e a confusão de “onde mora a verdade”.

### 3. Duplicação entre clientes

Web, iOS e Android com BFFs separados podem repetir agregação. Sem compartilhar libs ou contratos internos com critério, o mesmo join aparece três vezes — e diverge.

### 4. Latência de hop extra

Entre o browser e o domínio entra mais um salto. Bem desenhado, o hop compensa vários round-trips do cliente. Mal desenhado, você soma serialização e espera sem reduzir chamadas. O ganho não é automático: depende de agregar de verdade e de estar perto do usuário (edge / região certa).

### 5. Ownership e fronteira de time

Se o BFF “é do front” no discurso e “é do platform” na prática, ninguém prioriza. Contrato sem dono vira backlog eterno. O padrão só paga se o ownership for claro.

### 6. Tentação de overfetch “já que está no servidor”

Agregar demais no BFF esconde o custo até a tela ficar lenta por payload gigante. O contrato ainda precisa ser enxuto. Servidor não autoriza JSON obeso.

## O que ele realmente melhora para o lado do front

O ponto em que eu coloco ênfase: **o BFF melhora a honestidade da borda da interface**.

Sem ele, o front costuma:

1. orquestrar vários serviços;
2. mapear DTOs de domínio na UI;
3. carregar segredo ou lógica de autorização no client;
4. reagir a breaking change de API que a tela não pediu.

Com BFF alinhado à experiência:

1. a página consome um contrato de view;
2. loading, erro e empty state falam de um fluxo, não de N promises;
3. o bundle enxuga integração;
4. o time de UI discute shape de tela, não política interna de cada microsserviço.

Isso melhora três coisas concretas no dia a dia de front:

- **Velocidade de feature.** Menos glue code. Menos “esperar o outro time expor o campo”.
- **Previsibilidade de UI.** O modelo chega pronto para o componente. Menos `useEffect` encadeado só para montar o estado da página.
- **Segurança e limite de responsabilidade.** O browser deixa de ser o lugar onde a integração acontece. Volta a ser o lugar onde a experiência acontece.

No React moderno — Server Components, route handlers, BFF dedicado em Node — a ideia se repete: **dado sensível e agregação perto do servidor; interação perto do usuário**. O nome muda. A fronteira é a mesma.

## Quando faz sentido (e quando não)

Faz sentido quando:

- a tela agrega vários domínios;
- há diferença clara entre clientes (web vs app vs backoffice);
- o front está virando orquestrador;
- segredos ou autorização fina não podem viver no browser.

Pesa menos quando:

- um CRUD simples com uma API já estável resolve;
- o time não tem capacidade de operar mais um serviço;
- o “BFF” seria só um proxy 1:1 sem agregação nem adaptação.

Proxy sem valor de view não é BFF. É hop a mais com outro nome.

## Aprendizados que eu carrego

1. **BFF é contrato de experiência, não gateway genérico.** Se serve a todos os clientes com o mesmo JSON, você provavelmente tem uma API pública — não um BFF.
2. **Agregue o que a tela precisa; não replique o domínio.** Regra de negócio core fica no serviço de domínio.
3. **Meça round-trips e tamanho de payload.** O ganho do front aparece em waterfall e em shape — não no slide de arquitetura.
4. **Defina dono.** Time do cliente, com apoio de plataforma. Sem dono, o padrão apodrece.
5. **Versionar o contrato da UI.** O BFF existe para estabilizar a tela. Trate breaking change com o mesmo cuidado de uma lib de componentes.
6. **Não multiplique BFF por moda.** Um por experiência relevante. Não um por página por default.

**BFF não deixa o front “sem backend”. Ele deixa o front sem fingir que é backend.**

## O principal aprendizado?

**O front melhora quando para de orquestrar o grafo e passa a consumir um contrato feito para a tela.**

Vantagens — menos round-trips, shape de UI, segredos no servidor, evolução isolada — só compensam as desvantagens se o BFF permanecer fino, com dono e com métrica. As desvantagens — operação, god-api, hop extra — aparecem quando o padrão vira desculpa para empilhar serviço sem fronteira.

Comece pelo fluxo em que o browser já é o orquestrador. Tire a agregação para o servidor. Entregue um JSON que o componente entende sem tradução. Aí fica visível o que o BFF realmente melhora no front: menos cola, mais interface.
