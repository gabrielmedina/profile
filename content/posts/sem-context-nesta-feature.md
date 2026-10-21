---
title: 'Nesta feature, o estado não foi para a Context API'
description: 'Decisão local de uma entrega: o dado do fluxo ficou no React Query. O restante da aplicação manteve os providers que já faziam sentido.'
keys: 'Frontend, React, Context API, TanStack Query, Estado'
image: /imgs/posts/nao-usar-context-api.jpg
slug: sem-context-nesta-feature
lang: pt-BR
date: '2026-10-21'
---

![Capa: um cartão iluminado com uma estrela e três cartões apagados ao fundo.](/imgs/posts/nao-usar-context-api.webp)

Recentemente, na construção de uma funcionalidade de Front-end, precisávamos compartilhar entre os componentes o dado que a API devolvia. O caminho mais familiar era abrir um Context. Nesta feature, não seguimos por ele.

A escolha para neste fluxo. Tema, sessão, navegação e os providers que já existiam na aplicação continuam no lugar. O que mudou foi o estado desta entrega: ele já tinha dono no React Query.

## 1. Por que o Context não servia aqui

- O valor que iria para o Context era o retorno da query. Um estado local, preenchido depois da resposta, copiaria o dado. A informação passaria a existir em dois lugares e, cedo ou tarde, os dois divergiriam.
- Qualquer mudança nesse provider re-renderizaria todos os consumidores do fluxo, inclusive quem só lia um campo. Quem assina a chave da query não re-renderiza porque outra chave mudou.
- Carregamento, erro e nova tentativa já vinham prontos. `isPending`, `isError` e `refetch`. Reescrever isso no Context seria código a mais, só desta feature.
- Cache, tempo de validade, atualização ao voltar para a aba e deduplicação de pedidos feitos ao mesmo tempo já estavam na query. Context não oferece isso, e neste fluxo a gente precisava dos quatro.
- O Devtools mostra o cache da feature. Um provider novo não mostraria.

## 2. O que ficou no React Query

Estado de servidor e estado de interface apareceram os dois neste fluxo, e cada um teve um destino.

O dado remoto ficou na query. Lista, detalhe, status que o servidor pode alterar. Era o caso principal, e era dado que já deveria ser lido de lá.

Uma parte da interface também era compartilhada dentro da feature: a aba selecionada, o filtro que mais de um componente lia. Guardar isso no React Query não significou disparar outra requisição. Significou uma chave local, com `useQuery` e `setQueryData`, sem função de busca na rede. Fez sentido porque o fluxo já estava organizado em torno do cache.

O que durava só o tempo de um componente ficou em `useState`. Um passo, um painel aberto. Nem Context, nem query.

## 3. O que ficou como já estava

Esta feature não redesenhou o estado da aplicação.

- Navegação, menu e o que está selecionado fora deste fluxo continuam em provider. Transformar isso em query soaria forçado e não ganharia cache nenhum.
- Tema e sessão autenticada continuam em provider. Não são dado desta entrega.
- O formulário continua com a biblioteca que já resolve o estado interno.
- A árvore de providers da aplicação ficou intacta. A feature entrou nela. Não removemos um Context que outras rotas usam, porque a ordem dessa árvore importa e muda conforme a rota.

## 4. O cuidado dentro da feature

- A chave de interface ganhou um espaço separado, como `['ui', 'feature', 'aba']`, para não colidir com a chave do dado da API.
- O que precisava permanecer fresco entre uma visita e outra era o dado remoto. A revalidação da query cuidou disso. Não criamos um provider com armazenamento de sessão só para espelhar a resposta.
- Função guardada em estado, no padrão `useState(() => fn)`, não passa com naturalidade para `setQueryData`. Onde isso apareceu, ficou no componente.
- O teste desta feature monta um `QueryClientProvider`, com `retry: false`, e limpa o cache entre um caso e outro. O que seria mock de Context virou cliente pré-preenchido ou mock de `useQuery`. O teste afirma o que está na chave.

## 5. Como a decisão foi tomada

O critério vale para os valores deste fluxo.

- Se vinha do servidor, ou se mais de uma tela da feature precisava dele, ia para a query.
- Se era interface efêmera de um componente só, ficava em `useState`.
- Se era infraestrutura da aplicação, tema, sessão ou formulário, ficava fora da conversa.

O desenho que evitamos, aqui, era a query buscar a lista e um efeito copiar o resultado para um Context, só para um componente irmão ler de lá. O irmão passou a ler a mesma chave. Filtro e aba, quando eram da feature, foram para a chave de interface. A lista não foi duplicada.

No review desta entrega, `useState` espelhando o `data` da query era o sinal de que o Context tinha voltado pela porta dos fundos.

Três leituras, no próprio fluxo, mostraram que a escolha fazia sentido: menos re-renderização no trecho que doía, vista no profiler; menos código só para carregamento, erro e nova tentativa; e menos chance de a tela mostrar uma cópia enquanto a query já tinha outro valor.

## O principal aprendizado?

**A decisão boa foi a desta feature. Levar a mesma regra para a aplicação inteira seria outro problema.**

Context continua certo para o estado da aplicação que não é dado de servidor. Nesta entrega, o dado já estava no React Query. Abrir um Context teria duplicado o que o cache já entregava: um lugar só para ler, com deduplicação e revalidação.
