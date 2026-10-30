---
title: 'Como participo de uma tarefa antes da primeira linha de código'
description: 'Do refinamento à produção: um exemplo prático de como participo das decisões de produto, arquitetura e engenharia.'
keys: 'Front-end, Software Engineering, Cultura de Engenharia, IA'
image: /imgs/posts/como-eu-participo-de-uma-tarefa.jpg
slug: como-eu-participo-de-uma-tarefa
lang: pt-BR
date: '2026-10-30'
---

![Capa: quatro cartões com recorte de cupom sobem em arco; o da esquerda é fosco, o da direita acende em mint.](/imgs/posts/como-eu-participo-de-uma-tarefa.webp)

Quando uma tarefa chega para desenvolvimento, é natural começarmos a pensar na implementação: componentes, APIs, estados e arquitetura.

Eu também penso nisso. Mas, ao longo da minha experiência, passei a valorizar cada vez mais as decisões que acontecem antes da primeira linha de código.

**Hoje, procuro participar de uma tarefa olhando para toda a sua trajetória: do problema que queremos resolver até o comportamento da solução em produção.**

Para mostrar como isso acontece na prática, vou utilizar um exemplo hipotético: permitir que um cliente aplique um cupom de desconto diretamente na página de um produto.

A ideia não é apresentar a solução ideal, mas compartilhar como costumo participar das conversas e decisões ao longo de uma entrega.

## 1. Antes do código: entendendo o problema

### O refinamento começa com perguntas

Imagine que uma tarefa chegue com a descrição: **"Adicionar um campo para aplicação de cupom na página do produto."**

Parece simples: um campo, um botão, uma validação e a atualização do preço.

Mas antes de discutir a interface, gosto de entender a necessidade por trás dela.

- Qual dificuldade queremos resolver na jornada de compra?
- Queremos antecipar a visualização do desconto ou facilitar sua aplicação?
- Existem regras comerciais ou restrições que precisamos considerar?

Talvez o campo seja realmente a melhor solução. Talvez a dificuldade esteja em outro momento da jornada.

O objetivo não é questionar por questionar, mas contribuir para que o time compreenda o problema antes de decidir como resolvê-lo.

### Como vamos avaliar o resultado?

Além de entender a necessidade, procuro participar da definição do que esperamos alcançar.

No exemplo do cupom, poderíamos acompanhar a quantidade de aplicações bem-sucedidas, os erros mais frequentes e a continuidade da jornada após a aplicação do desconto.

Essa conversa acontece em conjunto com produto. Minha contribuição está em ajudar a transformar essas expectativas em comportamentos observáveis: eventos de analytics, estados de interface e pontos de monitoramento.

**Uma funcionalidade publicada representa uma entrega. Entender seu impacto ajuda a orientar as próximas decisões.**

## 2. Da necessidade à solução técnica

### Integrações e contratos

Com o comportamento esperado mais claro, começo a olhar para as dependências técnicas.

Existe uma API para validar o cupom? Ela considera as regras de elegibilidade? Retorna o preço atualizado ou precisamos consultar outro serviço?

Essas perguntas ajudam a alinhar as decisões com backend e identificar comportamentos que nem sempre aparecem no desenho inicial.

Um cupom pode estar expirado, ser incompatível com o produto ou não permitir combinação com outra promoção.

Cada situação precisa ser interpretada e comunicada pela interface.

**A experiência do usuário não termina na interface, assim como o contrato de uma API não termina na resposta de sucesso.**

### Escolhas de arquitetura

Depois, procuro entender como a funcionalidade se encaixa na arquitetura existente.

A página é pública, mas alguma operação exige autenticação? Preço, cupom e carrinho dependem de serviços diferentes? Podemos consumir uma API preparada para a jornada ou faz sentido utilizar um [BFF](/posts/bff-vantagens-e-desvantagens)?

São escolhas que envolvem responsabilidades, autenticação, cache, consistência de dados e tratamento de falhas.

Meu papel nessa etapa é ajudar a avaliar as alternativas, considerando o contexto técnico e as necessidades do produto.

**Uma boa decisão arquitetural não precisa ser a mais sofisticada. Precisa fazer sentido para o problema e para o momento do time.**

### Alinhando os critérios da entrega

Gosto de utilizar os conceitos de *Definition of Ready* (DoR) e *Definition of Done* (DoD) como apoio ao alinhamento.

O DoR nos ajuda a entender se temos contexto suficiente para começar. Já o DoD estabelece o que significa concluir a tarefa, considerando implementação, testes, integrações e validações necessárias.

Nem todas as respostas precisam existir desde o início. Algumas descobertas fazem parte do desenvolvimento.

O importante é que as dúvidas e os riscos estejam claros para que o time consiga decidir como avançar.

## 3. Durante a implementação

### Desenvolver e validar em pequenas etapas

Com a tarefa iniciada, procuro organizar a implementação de uma forma que facilite a evolução e as validações.

Uma mudança simples pode seguir um fluxo mais direto. Já uma funcionalidade com novas integrações e diferentes estados pode se beneficiar de uma branch de feature e entregas incrementais.

No exemplo do cupom, poderíamos começar pela interface, evoluir para a integração, tratar os estados de erro e finalizar com os eventos necessários para acompanhamento.

Também gosto de aproximar produto e design durante o desenvolvimento, especialmente quando surgem dúvidas sobre comportamentos específicos.

Um estado de carregamento, uma mensagem de erro ou uma regra de desconto podem ser mais fáceis de avaliar quando conseguimos visualizar a funcionalidade funcionando.

**Prefiro construir e validar ao longo do caminho, em vez de concentrar todas as descobertas na demonstração final.**

## 4. Da publicação ao acompanhamento

### Como vamos disponibilizar?

Antes da publicação, procuro participar da conversa sobre como a funcionalidade chegará aos usuários.

Dependendo do objetivo, podemos optar por uma liberação direta, gradual, por feature flag ou até um teste A/B.

Se quisermos medir o impacto de antecipar a aplicação de cupons, por exemplo, um experimento pode fazer sentido. Em outros cenários, uma liberação controlada é suficiente.

Também considero importante antecipar falhas: o que acontece se a API ficar indisponível? E se o cupom for aceito na página, mas recusado no checkout?

Pensar nesses cenários ajuda a definir testes, tratamentos de erro e o monitoramento necessário.

### O que aprendemos em produção?

Depois da publicação, gosto de acompanhar o comportamento real da funcionalidade.

Analytics, monitoramento de erros e ferramentas de observabilidade ajudam a entender se os fluxos estão funcionando e quais situações merecem atenção.

Nem todo resultado inesperado significa um problema técnico. Às vezes, ele revela uma hipótese de produto que não se confirmou ou uma experiência que pode ser melhorada.

Essas observações alimentam novas conversas e ajudam a orientar a evolução da solução.

**A publicação encerra uma etapa do desenvolvimento, mas também inicia uma oportunidade de aprendizado.**

## 5. Documentação: preservando as decisões

Ao longo de uma tarefa, fazemos escolhas que nem sempre ficam evidentes para quem encontra o código meses depois.

Por que utilizamos determinada API? Por que uma regra ficou no backend? Quais alternativas foram consideradas?

O código mostra o que foi implementado, mas nem sempre explica o contexto da decisão.

Por isso, valorizo registros técnicos curtos, como um *Architecture Decision Record* (ADR), principalmente quando a escolha influencia a evolução da aplicação.

Decisões específicas de front-end podem ficar próximas do código, enquanto acordos entre áreas podem estar em ferramentas compartilhadas, como o Confluence. O importante é facilitar o acesso e evitar informações duplicadas.

### E onde a IA entra nisso?

Com a inteligência artificial cada vez mais presente no desenvolvimento, manter esse contexto acessível ganhou ainda mais relevância.

Ferramentas de IA podem ajudar na implementação, nos testes e nas revisões de código. Mas a qualidade dessa contribuição depende também das informações disponíveis.

Se uma decisão importante existe apenas na memória de quem participou da tarefa, tanto uma nova pessoa quanto uma ferramenta de IA podem desconhecê-la.

Registrar o contexto no projeto ajuda a reutilizar essas decisões em novos desenvolvimentos, inclusive nos fluxos assistidos por IA.

**Documentar não é apenas preservar o passado. É facilitar as próximas decisões.**

## No fim, desenvolver também é construir entendimento

O exemplo do cupom mostra como uma tarefa aparentemente simples pode envolver produto, experiência do usuário, arquitetura, integrações e acompanhamento em produção.

Naturalmente, nem toda tarefa exige a mesma profundidade. Algumas mudanças pedem soluções diretas; outras precisam de mais investigação e alinhamento.

O que procuro manter é a disposição de compreender o contexto, colaborar com diferentes perspectivas e contribuir para decisões que façam sentido para o produto e para o time.

Com o tempo, percebi que minha contribuição como engenheiro front-end vai além da qualidade do código que escrevo. Ela também está na forma como participo das decisões que ajudam a transformar necessidades em soluções sustentáveis.

**A implementação é uma parte importante do trabalho. O entendimento que construímos juntos é o que ajuda a dar direção a ela.**