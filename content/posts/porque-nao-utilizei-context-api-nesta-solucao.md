---
title: 'Porque não utilizei Context API nesta solução'
description: 'Nesta solução o dado ficou no React Query. Tema, sessão e navegação continuaram nos providers que já existiam.'
keys: 'Front-end, React, Context API, TanStack Query, Estado'
image: /imgs/posts/nao-usar-context-api.jpg
slug: porque-nao-utilizei-context-api-nesta-solucao
lang: pt-BR
date: '2026-10-21'
---

![Capa: um cartão iluminado com uma estrela e três cartões apagados ao fundo.](/imgs/posts/nao-usar-context-api.webp)

Recentemente, numa funcionalidade de Front-end, vários componentes precisavam do mesmo dado que a API devolvia. O caminho mais familiar era abrir um Context. Nesta solução, não utilizei.

Tema, sessão e navegação continuaram nos providers que já existiam. A decisão foi só deste fluxo.

## 1. O problema

- O dado nascia numa query e precisava chegar em componentes irmãos.
- Um Context guardaria uma cópia: um estado preenchido depois da resposta.
- A tela passaria a ler de um lugar e a query de outro. Quando um atualizasse, o outro ficava para trás.

## 2. O que cada um resolveria

**Context.** Entrega um valor para a árvore. Serve para tema, sessão e o que está selecionado na navegação. Neste fluxo, só repassaria a resposta da API. Carregamento, erro, cache e nova tentativa ficariam escritos à mão.

**React Query.** O dado remoto já estava lá: cache, deduplicação, revalidação ao voltar para a aba, `isPending`, `isError` e `refetch`. A aba e o filtro, lidos por mais de um componente, foram para uma chave local, sem nova requisição. O que durava um componente só ficou em `useState`.

## 3. A vantagem de usar só o React Query

- Um lugar para ler o dado desta solução.
- Menos código só para carregamento, erro e nova tentativa.
- Quem observa uma chave não re-renderiza porque outra mudou.
- O Devtools mostra o cache do fluxo.

## 4. Os maiores desafios

- Separar o que era dado de servidor do que era interface de um componente só. Forçar tudo para query pioraria a leitura.
- Dar nome à chave de interface, separado da chave da API, para as duas não se misturarem.
- No teste, trocar o mock de Context por um cliente de query, com nova tentativa desligada e cache limpo entre os casos.

## O principal aprendizado?

**Context resolveria o compartilhamento. React Query já resolvia o dado.**

Nesta solução, abrir um Context seria criar um segundo dono para uma resposta que o cache já entregava.
