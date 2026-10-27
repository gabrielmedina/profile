---
title: 'A IA fica perto do projeto quando a decisão já está escrita.'
description: 'No Raise Clubs, a plataforma evolui por especificação. Convenção, decisão e aceite ficam no repositório para o modelo implementar o front-end que eu espero.'
keys: 'Front-end, Software Engineering, IA'
image: /imgs/posts/a-ia-fica-perto-quando-a-decisao-esta-escrita.jpg
slug: a-ia-fica-perto-quando-a-decisao-esta-escrita
lang: pt-BR
date: '2026-10-22'
---

![Capa: três cartões de vidro ligados por uma linha, o do centro aceso com uma estrela.](/imgs/posts/a-ia-fica-perto-quando-a-decisao-esta-escrita.webp)

No [Raise Clubs](https://raiseclubs.com) eu tenho testado uma pergunta que vale para qualquer front-end com IA: como o modelo evolui o produto e ainda entrega o front-end que eu espero.

A prática é spec-driven development. A mudança nasce escrita. O código executa o que já foi decidido. A decisão fica no repositório, no endereço que a próxima sessão lê primeiro.

## 1. A plataforma evolui pela especificação

O ciclo é curto: especificar, desenhar, fatiar, executar.

A especificação diz o que o produto faz e o que está pronto. O desenho guarda o contrato, o modelo e o lugar do arquivo. A fila tem uma tarefa, com verificação no fim. Se o comportamento ou o caminho mudou, a especificação e o desenho atualizam antes da próxima sessão.

Uma lacuna vira item da fila. Quando a escolha atravessa mais de uma parte do produto, vira uma decisão registrada uma vez. O modelo não completa o buraco com uma regra nova.

O Raise é o terreno. Torneio, ranking, cash e a página do clube entram por esse ciclo. O miolo técnico de cada um fica para os próximos posts.

## 2. Decisão armazenada é contexto barato

Um modelo eficiente não redescobre o projeto a cada prompt.

O padrão de pasta, rota e React mora num documento, e esse documento vence o código que divergiu. Decisão compartilhada tem status e um único lugar. O foco da sessão cabe em poucas linhas: o que está em andamento, o que bloqueia, qual é o próximo passo.

A ordem de leitura vem antes da implementação. Convenção, foco, decisões, especificação da feature. O recorte da tarefa é o teto. O que aparecer fora dele fica anotado.

No fim da onda, a fila solta o que já foi entregue. Histórico longo puxa o modelo para trás. Fila curta o segura na mudança que importa.

## 3. Perto do front-end que eu espero

Eficiência, aqui, é o arquivo certo no lugar certo.

Rota que só carrega. Página que orquestra. Seção que pinta. Dado de servidor na query. Escuta ao vivo só na tela que precisa acompanhar. Serviço de servidor ao lado da API. Componente em pasta, com o nome do que exporta.

Isso está escrito como padrão. Quando o código foge, a convenção permanece: ou o código volta, ou a convenção muda antes da próxima linha. A sessão seguinte herda o mesmo front-end.

## O principal aprendizado?

**A IA fica eficiente quando aplica uma decisão que já está escrita.**

Spec-driven development é como o [Raise Clubs](https://raiseclubs.com) evolui. O registro — convenção, decisão, especificação, desenho e fila — é o que mantém o modelo perto do que eu espero de um projeto front-end.

Em breve trago outros posts técnicos desse projeto.
