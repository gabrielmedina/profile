---
title: 'Por que não usamos Context API para compartilhar estado'
description: 'Estado remoto ficou no React Query. Context ficou só para o que não é dado de servidor.'
keys: 'Frontend, React, Context API, TanStack Query, Estado'
image: /imgs/posts/nao-usar-context-api.jpg
slug: nao-usar-context-api
lang: pt-BR
date: '2026-10-21'
---

![Capa: um cartão iluminado com uma estrela e três cartões apagados ao fundo.](/imgs/posts/nao-usar-context-api.webp)

Recentemente, precisamos decidir como compartilhar estado em uma funcionalidade de Front-end. O caminho mais familiar era abrir um Context. Escolhemos não seguir por ele.

Mais do que uma preferência de biblioteca, a decisão veio de um desenho que já usávamos: Context para o que é compartilhado, React Query para o que vem do servidor. Na prática, essa fronteira vazava. Quero registrar o que pesou, o que de fato mudou e onde Context continua no lugar certo.

## 1. O que nos fez trocar

- Parte do que vivia no Context era cópia do que o React Query já tinha buscado. Um estado local, preenchido depois da resposta, espelhava o dado da query. A informação passava a existir em dois lugares e, cedo ou tarde, os dois divergiam.
- Qualquer mudança no valor do Context re-renderiza todos os consumidores, inclusive quem só lia um campo. Quem assina uma chave do React Query não re-renderiza porque outra chave mudou.
- Cada feature reescrevia carregamento, erro e nova tentativa. `isPending`, `isError` e `refetch` já entregam esse contrato.
- Context não tem cache, tempo de validade, atualização ao voltar para a aba ou ao reconectar, nem deduplicação de pedidos feitos ao mesmo tempo. Tudo isso era código nosso.
- O Devtools do React Query mostra o que está em cache. Com Context, essa visibilidade não existe de forma nativa.

## 2. O que realmente saiu do Context

Estado de servidor e estado de interface não são o mesmo problema.

Estado de servidor é dado remoto. Lista, detalhe, status que outra pessoa pode alterar. Esse dado já deveria viver no React Query.

Estado de interface é o que só existe na tela: modal aberto, passo de um fluxo, filtro selecionado. Usar React Query também nesse caso não significa disparar uma requisição. Significa guardar o valor em uma chave local, com `useQuery` e `setQueryData`, sem função de busca na rede.

São dois escopos diferentes. Parar de espelhar dado remoto no Context corrige uma fronteira. Eliminar Context também para estado de interface muda o modelo da aplicação. Tratamos os dois com o cuidado que cada um pede, sem misturar o anúncio da decisão.

## 3. Onde Context continua

A decisão não apaga o Context. Apaga o uso dele como gaveta padrão.

- Estado global de interface, sem relação com servidor, continua em provider. O que está selecionado na navegação, o menu aberto, o módulo em que a pessoa está. Transformar isso em query soa forçado e não ganha cache nenhum.
- Tema e sessão autenticada também ficam em provider. Não são dado remoto com validade e revalidação.
- Formulário tem dono. A biblioteca de form já resolve o estado interno, e o Context que ela usa não é alvo dessa troca.
- Estado efêmero de um único componente fica em `useState`. Nem Context, nem query.

## 4. O que exige cuidado

- A ordem dos providers importa. Alguns dependem de quem está acima e mudam conforme a rota. Remover o Context errado quebra essa cadeia, mesmo quando o dado parece simples.
- Chave de estado local precisa de convenção. Um espaço separado, como `['ui', 'feature', 'aba']`, evita colidir com chave de dado real.
- O que hoje persiste entre recarregamentos, em sessão ou no armazenamento do navegador, precisa de uma estratégia equivalente: persistir o cache do cliente ou sincronizar na mão. Tirar o Context não pode apagar a preferência de quem usa.
- Função guardada em estado, no padrão `useState(() => fn)`, não se transfere com naturalidade para `setQueryData`. Esse caso fica como exceção, não como detalhe.
- A troca é incremental, uma feature de cada vez. Um padrão espalhado pelo código não muda em um único pull request.

## 5. Como a troca aconteceu

O critério para decidir o destino de cada valor ficou objetivo.

- Se depende do servidor, ou se mais de uma tela precisa dele, é candidato a query.
- Se é interface efêmera de um componente só, fica em `useState`.
- Se é infraestrutura da aplicação, tema, sessão ou formulário, permanece no provider ou na biblioteca que já é dona daquele estado.

A primeira fase eliminou a duplicação: dado remoto copiado para dentro do Context. É o ganho mais claro e o menor risco. O antes é uma query que busca a lista e um efeito que copia o resultado para o Context, só para um componente irmão ler de lá. O depois é o irmão lendo a mesma chave. Filtro e aba, quando são só da tela, vão para uma chave de interface. A lista não é duplicada.

A segunda fase olha, caso a caso, os Contexts que só existem para compartilhar estado de feature entre componentes irmãos. Alguns viram chave local. Outros ficam, porque forçar a troca pioraria a leitura.

No review, `useState` que apenas espelha o `data` de uma query passou a ser ponto de checagem do pull request. A regra escrita no guia não segura sozinha se a revisão não olha para ela.

O setup de teste também mudou. A árvore que injetava os providers de Context passa a montar um `QueryClientProvider`, com `retry: false`. Entre um teste e outro, o cache é limpo. Sem isso, um caso vaza estado para o seguinte. O mock do Context dá lugar a um cliente pré-preenchido ou a um mock de `useQuery`. O teste afirma o que está na chave, não o que o provider injetou.

## Como sabemos que valeu

Três sinais, medidos antes e depois, evitam que a decisão fique só no gosto.

- Quantidade de re-renderizações no fluxo que doía, vista no profiler do React.
- Menos código escrito só para carregamento, erro e nova tentativa.
- Menos defeito de dado desencontrado, quando a tela mostra uma cópia e a query já tem outra.

A referência do time precisa contar essa versão. Enquanto o guia ainda descreve o modelo híbrido como padrão, quem chega depois reconstrói o Context que acabamos de aposentar. Um antes e depois, com um caso real de dado duplicado, segura a decisão melhor do que uma regra solta.

## O principal aprendizado?

**Trocar de ferramenta sem nomear o problema só muda o lugar onde o estado se perde.**

Context não falhou como API. Falhou como lugar padrão para dado que já tinha dono. React Query assume cache, deduplicação e revalidação. Context continua onde o valor é da aplicação, não do servidor. A decisão boa é saber qual dos dois está em jogo antes de criar o próximo provider.
