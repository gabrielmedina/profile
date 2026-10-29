---
title: 'Como eu participo de uma tarefa antes do código'
description: 'Do refinamento ao registro: o caminho que eu percorro numa tarefa, sem chegar com a solução pronta. O cupom só dá lugar às perguntas.'
keys: 'Front-end, Software Engineering, Cultura de Engenharia, IA'
image: /imgs/posts/como-eu-participo-de-uma-tarefa.jpg
slug: como-eu-participo-de-uma-tarefa
lang: pt-BR
date: '2026-10-29'
---

![Capa: quatro cartões com recorte de cupom sobem em arco; o da esquerda é fosco, o da direita acende em mint.](/imgs/posts/como-eu-participo-de-uma-tarefa.webp)

O próximo ciclo já tem tema. A gente sabe o que vai trabalhar. Eu não chego com a tela desenhada.

O que eu levo é um caminho. As perguntas com que eu participo, na ordem em que elas aparecem: o que a tarefa resolve, como vamos saber se deu certo, qual é o contrato, como a tela chega nele, como desenvolvemos, como lançamos, e onde a decisão fica escrita para a próxima pessoa.

Para as perguntas terem onde cair, vou usar um card que todo mundo já viu: aplicar um cupom de desconto na página do produto. Ele não é a solução deste post. As respostas são do time daquela tarefa. O que eu quero deixar é o jeito de planejar.

**Minha parte é abrir o caminho. A solução é o que a conversa produz.**

## O que queremos resolver

O card muitas vezes já nomeia uma forma. "Campo de cupom na página." Eu trato isso como hipótese. O problema pode ser outro, e eu ainda não sei qual.

No cupom, as perguntas que eu coloco na mesa:

- Onde a pessoa falha hoje? Descobre o código tarde, não sabe se aquele produto aceita, ou vê o preço mudar e desiste?
- O campo na página é o lugar certo, ou já é um desenho que alguém adiantou?
- O que fica de fora desta tarefa, para o problema não crescer no meio da sprint?

Eu saio desta conversa quando o time reconhece o problema numa frase. Se a frase continua sendo "colocar o campo", o refinamento ainda não aconteceu. A forma da solução espera essa frase existir.

## O que vai indicar sucesso ou fracasso

A tela no ar não me diz se a tarefa funcionou. Antes da sprint, eu peço um sinal de sucesso, um sinal de fracasso e o lugar onde alguém vai ler os dois.

No cupom, os caminhos que eu abro para o time escolher:

- aplicação de um código válido
- quem segue adiante depois de aplicar, comparado com quem viu e não usou
- erro que interrompe a sessão: código inválido, expirado, produto de fora
- o preço desta página e o preço do passo seguinte contando a mesma história

Eu não escolho o gráfico no lugar do time. Também não deixo a conversa fechar em "a gente vê os números depois". O número precisa de um dono antes de a tarefa entrar.

## O contrato com o backend

Aqui eu não desenho o payload. Eu descubro se ele existe.

- A API já existe, ou ainda é uma conversa?
- O que ela precisa receber para esta tela?
- O que ela devolve? Um sim ou não basta, ou a página precisa de preço e de um motivo quando não aplica?
- Onde isso está escrito, fora de uma thread?

Se a resposta for "o front consome o que já tem" e ninguém abre o contrato, para mim a tarefa ainda não está pronta. O buraco entra no refinamento, com alguém de backend. O componente não completa o que o contrato não disse.

## Como a tela vai chegar nesse contrato

Esta é a parte em que é mais fácil eu chegar com a arquitetura pronta. Eu chego com os caminhos.

- A página é pública? O fluxo inteiro também, ou algum caso pede sessão?
- Dá para chamar um endpoint só, feito para esta tela?
- A tela precisa reunir várias chamadas? Preço, elegibilidade e carrinho vivem no mesmo lugar?
- Se forem vários serviços, já existe um [BFF](/posts/bff-vantagens-e-desvantagens), ou algo no lugar dele, ou o browser é quem vai orquestrar?

Cada resposta muda o tamanho do trabalho. Eu quero essa escolha na planning, com o time, e o que ficar de fora com nome. Decidir na implementação é a solução entrando sem ter passado pela conversa.

## O que o time passa a perguntar sempre

Essas quatro conversas são o que eu proponho como **DoR** (Definition of Ready), definido com o time, para não depender de eu estar na sala. A tarefa entra na sprint quando dá para responder:

- O que queremos resolver, separado da forma que o card sugeriu?
- O que indica sucesso, o que indica fracasso, e onde isso será lido?
- A API existe? O que recebe, o que devolve, e onde está escrito?
- A superfície é pública? Precisa de sessão? Uma chamada ou várias?

Sem resposta, eu peço para a tarefa ficar de fora. Ela pode entrar com a lacuna escrita e um dono, quando o time aceita o risco de propósito.

O **DoD** (Definition of Done) eu escrevo com o que essas respostas produzirem. A tarefa fica pronta quando a tela cumpre o combinado, produto reconhece os estados que listamos, o lançamento segue o plano e o sinal está sendo coletado. O done não é uma lista genérica. É o espelho do refinamento.

**O DoR é o hábito de perguntar. O DoD é o que a resposta virou.**

## Dentro da sprint

O formato do trabalho também é uma pergunta, não um costume.

One-shot cabe quando a mudança não abre estado novo: um texto, um token, um ajuste pequeno. Se a tarefa mexe em vazio, carregamento, erro, preço ou no que vamos medir, eu abro uma branch de feature. No cupom, eu olho quantos estados a planning listou. Essa lista escolhe o formato. Eu não presumo a branch porque o card parece grande.

Com produto, eu combino olhar no meio, não na demo do fim. Os estados saem do refinamento. Podem ser campo vazio, código aceito, recusa, chamada que não responde. Podem ser outros. O que eu seguro é o ritmo: um estado visível, produto compara com o que foi descrito, e a fatia seguinte espera essa ainda ser a tarefa combinada.

## Como vamos lançar

Implementar não encerra a minha parte. Na conversa de ship, eu levo três caminhos.

O primeiro é o modo. Teste A/B quando a hipótese precisa de tempo para aparecer no sinal, e o time pode esperar. Subida direta quando uma data é o requisito, e não ter a feature naquele dia já é o fracasso. Eu pergunto qual dos dois o refinamento descreveu. O costume não escolhe.

O segundo é o sinal. Os indicadores que nomeamos antes da sprint estão no evento antes de abrir a feature? Se o gráfico nasce depois, a primeira semana não ensina. Eu peço para a coleta fazer parte da entrega.

O terceiro é o caminho que ninguém desenhou. Qual erro vamos enxergar? Qual resposta de sucesso pode vir com o preço igual ao de antes? Qual aceite na tela pode ser recusa no passo seguinte? Quem está logado e quem não está podem divergir? Um alerta nesse tipo de caminho mostra o plano incompleto enquanto ainda dá para corrigir.

## Em produção, acompanhar

Publicou. O plano está feito. A minha parte passa a ser olhar o que a gente disse que olharia.

O sinal anda no sentido combinado, e o erro cabe no que aceitamos: isso é sucesso. A feature está no ar e o gráfico parado, ou o erro come a sessão: isso é fracasso. Os dois autorizam outra volta, na mesma trilha, com uma pergunta mais estreita. Eu não abro um título novo para recomeçar o planejamento do zero.

## Onde a decisão de front fica

O caminho até aqui produziu escolhas. Se elas ficam na cabeça de quem implementou, a próxima pessoa refaz o refinamento. Uma IA, na sessão seguinte, também. Os dois preenchem o buraco com uma regra que ninguém combinou.

No fim da trajetória eu registro a decisão de frontend. Curta, com data, num endereço só:

- o problema, numa frase
- os caminhos que estiveram na mesa
- a escolha e a consequência
- o que ficou de fora
- o contrato de que a tela depende
- como vamos saber se funcionou
- o que faria a gente reabrir

Tem time que chama isso de ADR. O nome importa menos do que o lugar. Dois lugares costumam competir, e eu não uso os dois como arquivo da mesma coisa.

**No projeto.** Ao lado da feature, ou num registro que o repositório já abre antes do código. Quem pega a próxima tarefa encontra o texto junto dela. O pull request atualiza a decisão na mesma mudança do comportamento. Para uma IA, isso é o que torna a decisão utilizável: a sessão lê o repositório primeiro. Fora desse caminho, o texto [não chega na sessão](/posts/a-ia-fica-perto-quando-a-decisao-esta-escrita), a menos que alguém cole na hora. O limite é o resto do squad. Produto e backend nem sempre vivem nesse repo.

**No Confluence**, ou na ferramenta em que a empresa já decide. O squad lê sem clonar o front. Cabe no acordo que atravessa papéis: problema, sinal de sucesso, como vamos lançar. O limite é o inverso. A página envelhece longe do código. A sessão de uma IA não abre o wiki sozinha. Duas cópias inteiras viram duas verdades.

O caminho que eu deixo é separar os dois públicos sem duplicar o texto. A decisão que ensina a próxima mudança de front mora no projeto, no endereço que a pessoa e o modelo leem primeiro. O acordo do squad mora onde o squad já se encontra. Um dos dois é a fonte. O outro é um link.

Se só um lugar for ficar de pé, eu fico com o projeto para a decisão de frontend. A página no Confluence aponta para o arquivo. A próxima pessoa acha. A próxima sessão também, sem depender de alguém lembrar de colar.

**Decisão sem endereço não entra na tarefa seguinte. Nem na sessão seguinte.**
