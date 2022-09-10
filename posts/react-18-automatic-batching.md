---
title: 'React Automatic Batching'
description: 'Agrupando atualizações de estado para evitar novas renderizações desnecessárias.'
keys: 'React 18, Batching, Estado'
image: /imgs/posts/post-react-18-automatic-batching.webp
slug: react-automatic-batching
lang: pt-BR
date: '2022-09-09'
---

O React 18 passou a adotar a estratégia de batching (lote) para **agrupar as atualizações de estado**, tendo como efeito a **redução na quantidade de novas renderizações**.

![Imagem contendo a logo do React + o texto Automatic Batching.](/imgs/posts/post-react-18-automatic-batching.webp)

Versões anteriores suportam essa estratégia apenas nos eventos nativos do navegador. No entanto, com a atualização do React 18, Automatic Batching passa a ser o comportamento padrão.

## Exemplos

<sub>Execute as sandboxs e verifique o console. Lá deve constar a quantidade de vezes que o component foi renderizado.</sub>

**React 18 com Automatic Batching**

<iframe src="https://codesandbox.io/embed/automaticbatching-t7mv89?runonclick=1&fontsize=14&hidenavigation=0&theme=dark"
  style="height:60vh; border:0; overflow:hidden;"
  title="AutomaticBatching"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

**React 17 sem Automatic Batching**

<iframe src="https://codesandbox.io/embed/withoutautomaticbatching-db6wec?runonclick=1&fontsize=14&hidenavigation=0&theme=dark"
  style="height:60vh; border:0; overflow:hidden;"
  title="WithoutAutomaticBatching"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Referências

- [reactjs.org/react-v18](https://reactjs.org/blog/2022/03/29/react-v18.html)
