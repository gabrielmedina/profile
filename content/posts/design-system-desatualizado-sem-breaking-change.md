---
title: 'Design system desatualizado custa caro. Toda inovação virar breaking change custa mais.'
description: 'Os riscos de um design system parado no tempo e os desafios reais para evoluir componentes sem transformar cada melhoria numa migração obrigatória.'
keys: 'Front-end, Design System, UX'
image: /imgs/posts/design-system-desatualizado.jpg
slug: design-system-desatualizado-sem-breaking-change
lang: pt-BR
date: '2026-10-25'
---

![Capa: grade de peças de vidro; uma delas rachada e apagada, sugerindo breaking change.](/imgs/posts/design-system-desatualizado.webp)

Um design system que não evolui deixa de ser acelerador e vira atrito. Um design system que só evolui por breaking change deixa de ser contrato e vira fila de migração.

Já vi os dois lados. O DS congelado, com tokens, espaçamentos e padrões que o produto já abandonou. E o DS que “inova” a cada sprint, quebrando APIs de componente e empurrando o custo da mudança para todos os times consumidores.

A pergunta útil não é se o design system deve mudar. É **como mudar sem transformar toda melhoria numa quebra**.

## 1. O risco de ficar parado

Um design system desatualizado não falha de uma vez. Ele falha aos poucos.

- Produto e DS divergem: o time de produto entrega um padrão novo; o DS ainda documenta o antigo.
- Aparece um segundo sistema informal: forks locais, CSS paralelo, variantes “só desta tela”.
- A consistência vira teatro: a biblioteca existe, mas a experiência real do usuário é outra.
- Onboarding fica mentiroso: a documentação ensina um caminho que o código de produção já não segue.
- Dívida visual e de interação se acumula até que uma “grande atualização” parece inevitável — e essa atualização quase sempre chega como breaking change em massa.

Parar de evoluir não preserva estabilidade. Adia a fatura e aumenta o juros.

## 2. O outro risco: inovar quebrando o contrato

Inovar no DS é necessário. Tokens mudam. Acessibilidade melhora. APIs ruins precisam sair. O problema começa quando **toda** inovação exige que o consumidor pare e migre.

Breaking change tem custo real:

- Times param features para atualizar imports, props e estilos.
- Releases ficam acopladas: ninguém sobe o DS sem um plano de migração.
- A confiança no contrato cai. Se a API muda sempre, o time prefere copiar o componente do que depender dele.

Um design system saudável muda. Um design system saudável também protege quem consome.

## 3. Os maiores desafios para não virar break a cada passo

### Separar aparência de contrato

Nem toda mudança visual precisa tocar na API pública. Cor, tipografia e espaçamento bem modelados em tokens evoluem sem forçar rename de props. Quando estilo e contrato estão misturados no mesmo eixo, qualquer polish vira migração.

### Versionar de verdade

Semântica de versão não é etiqueta de marketing. Additive changes entram em minor. Remoções e renomes entram em major — com caminho de saída. Se tudo é major, nada é major.

### Preferir extensão a substituição

Nova variante, nova prop opcional, novo slot. Só depois, com adoção medida, deprecar o caminho antigo. Substituir de primeira é tentador porque limpa o código do DS. O custo limpa o código dos outros.

### Deprecar com prazo e telemetria

Avisar não basta. Precisa de warning claro, docs de migração, data de remoção e alguma forma de saber quem ainda usa o caminho antigo. Sem isso, a depreciação vira surpresa no major seguinte.

### Governar o que é público

Nem tudo no pacote é contrato. API pública pequena e estável. Helpers internos fora do export. Quanto maior a superfície pública, maior a chance de uma melhoria interna virar break externo.

### Alinhar design e engenharia no mesmo ciclo

Se o Figma avança e o pacote atrasa — ou o pacote avança e o Figma congela — nasce drift. Drift vira fork. Fork vira breaking change disfarçada de “alinhamento”.

### Medir adoção antes de remover

Remover o que “ninguém usa” sem evidência é chute. Evidência pode ser lint, codemod dry-run, busca no monorepo ou telemetria de import. Remoção sem mapa de uso é dívida transferida.

## 4. Uma regra prática que tem funcionado

Antes de mudar um componente, eu faço três perguntas:

1. Isso muda o contrato público ou só o comportamento interno/visual tokenizado?
2. Existe um caminho additive (prop nova, variante nova, wrapper) que entregue o valor agora?
3. Se a remoção for inevitável, qual é o prazo, o guia de migração e quem ainda depende disso?

Se a resposta para a primeira for “contrato” e para a segunda for “não”, aí sim estamos falando de breaking change — e ela precisa ser consciente, versionada e acompanhada. Não automática.

## O principal aprendizado?

**Design system desatualizado cria forks. Design system que só inova por break cria medo. O trabalho difícil é evoluir o contrato sem abandonar quem já confia nele.**

Inovação no DS não é só o componente novo. É a disciplina de chegar lá sem obrigar o produto inteiro a parar a cada passo.
