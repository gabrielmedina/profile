---
title: 'BFF: o que melhora no front-end e o que custa manter'
description: 'Entenda como o Backend for Frontend simplifica integrações, seus benefícios para a interface e os custos que precisam entrar na decisão arquitetural.'
keys: 'Front-end, Software Engineering, React'
image: /imgs/posts/bff-vantagens-e-desvantagens.jpg
slug: bff-vantagens-e-desvantagens
lang: pt-BR
date: '2026-10-29'
---

![Capa: três nós de serviço à esquerda ligam a um cartão de vidro central (BFF); uma linha segue até a tela do cliente à direita.](/imgs/posts/bff-vantagens-e-desvantagens.webp)

Em aplicações que dependem de diferentes serviços, é comum encontrar interfaces responsáveis por buscar, combinar e adaptar informações antes mesmo de apresentá-las ao usuário.

O problema é que, conforme o produto evolui, essa responsabilidade pode crescer. Uma página passa a depender de várias requisições, diferentes contratos e regras de integração que tornam o front-end mais complexo.

É nesse cenário que o **Backend for Frontend (BFF)** pode fazer sentido.

A proposta é criar uma camada de backend dedicada às necessidades de uma experiência, como uma aplicação web, mobile ou backoffice.

**Mais do que adicionar uma API à arquitetura, o BFF permite repensar onde determinadas responsabilidades devem estar.**

## 1. Entendendo o papel do BFF

O padrão, descrito por [Sam Newman](https://samnewman.io/patterns/architectural/bff/), propõe um backend específico para determinada experiência de usuário, em vez de depender exclusivamente de uma API genérica compartilhada por diferentes clientes.

Na prática, essa camada pode agregar respostas de vários serviços, adaptar contratos e organizar informações de acordo com as necessidades da interface.

Imagine uma página de produto que precisa consultar preço, estoque, promoções e informações do catálogo.

Sem um BFF, o browser pode ser responsável por coordenar diferentes requisições e combinar as respostas.

Com um BFF, parte desse trabalho pode acontecer no servidor, disponibilizando um contrato mais próximo do que a página realmente precisa.

Isso não significa transferir toda a lógica para o BFF. As regras de negócio continuam pertencendo aos serviços responsáveis por cada domínio.

**O BFF atua como uma camada de adaptação entre as necessidades da interface e as capacidades do backend.**

## 2. O que melhora para o front-end?

### Menos complexidade nas integrações

Uma das vantagens mais perceptíveis é reduzir a quantidade de integrações que a interface precisa coordenar.

Em vez de consumir diferentes serviços e transformar suas respostas, o front-end pode trabalhar com um contrato preparado para determinada jornada.

Isso tende a simplificar componentes, reduzir código de adaptação e tornar a gestão dos dados mais previsível.

No React, por exemplo, podemos reduzir parte da lógica dedicada exclusivamente a combinar respostas de diferentes APIs.

A interface continua responsável por seus estados de carregamento, erro e interação, mas com menos detalhes de integração para administrar.

### Contratos próximos da experiência

Serviços de domínio normalmente organizam informações conforme suas próprias responsabilidades. Nem sempre essa estrutura é a mais adequada para uma tela.

Um BFF pode transformar esses dados em um modelo mais conveniente para o consumo da interface, mantendo a separação entre domínio e apresentação.

Também pode facilitar a evolução dos serviços internos, absorvendo determinadas mudanças sem exigir adaptações imediatas no front-end.

### Segurança e responsabilidades mais claras

Outra contribuição importante é manter credenciais de serviço e integrações sensíveis no ambiente de servidor.

O BFF pode atuar na mediação de autenticação e autorização, respeitando as permissões do usuário e os controles necessários em cada serviço.

Isso não elimina as responsabilidades de segurança do browser ou do backend, mas ajuda a estabelecer limites mais claros.

**Para mim, o principal benefício está em permitir que o front-end concentre mais esforços na experiência e menos na coordenação dos serviços que a sustentam.**

## 3. Os custos que também precisam entrar na conversa

Apesar dos benefícios, adotar um BFF não significa necessariamente simplificar a arquitetura como um todo.

Parte da complexidade é transferida para uma nova camada, que também precisa ser desenvolvida, monitorada e mantida.

### Operação e manutenção

Um BFF dedicado pode exigir infraestrutura, deploy, observabilidade, tratamento de falhas e acompanhamento de performance.

Também passa a representar uma dependência importante para o funcionamento da aplicação.

Por isso, considero essencial avaliar se o time possui capacidade de manter essa camada ao longo do tempo.

### Limites de responsabilidade

Outro cuidado é evitar que o BFF acumule regras de negócio que pertencem aos serviços de domínio.

Seu papel é adaptar, compor e disponibilizar informações para a experiência, não substituir os sistemas responsáveis por elas.

Quando essa separação não está clara, podemos acabar criando duplicações e dificultando a evolução da arquitetura.

### Performance não melhora automaticamente

Adicionar uma camada também significa introduzir um novo ponto de processamento e comunicação.

Em alguns cenários, agregar chamadas no servidor reduz a quantidade de requisições feitas pelo browser e melhora o tempo de resposta percebido.

Em outros, um BFF pouco otimizado pode adicionar latência sem oferecer benefícios relevantes.

Por isso, gosto de considerar métricas como tempo de resposta, quantidade de requisições, tamanho dos payloads e comportamento das dependências antes e depois da mudança.

**O BFF precisa resolver uma necessidade real, não apenas acrescentar uma nova abstração.**

## 4. Quando considero esse padrão?

A decisão depende principalmente da complexidade das integrações e das necessidades do produto.

Vejo valor no BFF quando uma interface depende de diferentes domínios, precisa de contratos específicos ou concentra muita lógica de integração no cliente.

Também pode fazer sentido quando web, mobile e backoffice possuem necessidades distintas e precisam evoluir de forma relativamente independente.

Por outro lado, em uma aplicação com integrações simples e APIs já adequadas ao consumo, introduzir essa camada pode representar mais trabalho do que benefício.

### E no ecossistema React?

Frameworks como Next.js oferecem recursos de execução no servidor, como Server Components e Route Handlers, que permitem realizar integrações e adaptar dados sem necessariamente criar um serviço BFF separado.

Esses recursos podem atender parte das mesmas necessidades, dependendo da arquitetura.

Isso não torna um BFF dedicado desnecessário em todos os cenários. A decisão envolve fatores como isolamento, escalabilidade, organização dos times e responsabilidades da aplicação.

O que procuro avaliar é onde a integração faz mais sentido e qual alternativa oferece o melhor equilíbrio entre simplicidade, manutenção e evolução.

## O que levo dessa abordagem

O BFF é um padrão interessante porque aproxima as necessidades da interface das decisões de arquitetura.

Quando bem aplicado, pode simplificar integrações, oferecer contratos mais adequados e diminuir o acoplamento entre o cliente e os serviços internos.

Mas esses benefícios precisam ser considerados junto aos custos de operação, manutenção e complexidade adicional.

Ao avaliar sua adoção, procuro entender o problema atual, discutir alternativas e identificar quais responsabilidades realmente precisam mudar de lugar.

Nem toda aplicação precisa de um BFF, assim como nem toda integração precisa acontecer diretamente no browser.

**No fim, a melhor arquitetura não é necessariamente aquela com mais camadas, mas a que distribui responsabilidades de forma coerente com o produto e com as necessidades de quem vai mantê-la.**