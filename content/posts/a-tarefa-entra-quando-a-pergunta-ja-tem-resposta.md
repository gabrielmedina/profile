---
title: 'A tarefa entra na sprint quando a pergunta já tem resposta'
description: 'Aplicar um cupom na página do produto, do refinamento ao que a gente olha em produção. O que separa um título de uma tarefa pronta.'
keys: 'Front-end, Software Engineering, Cultura de Engenharia'
image: /imgs/posts/a-tarefa-entra-quando-a-pergunta-ja-tem-resposta.jpg
slug: a-tarefa-entra-quando-a-pergunta-ja-tem-resposta
lang: pt-BR
date: '2026-10-29'
---

![Capa: quatro cartões com recorte de cupom sobem em arco; o da esquerda é fosco, o da direita acende em mint.](/imgs/posts/a-tarefa-entra-quando-a-pergunta-ja-tem-resposta.webp)

O próximo ciclo já tem tema. A gente sabe o que vai trabalhar. Isso ainda não é uma tarefa.

Um card no board — aplicar um cupom de desconto na página do produto — cabe numa planning e ainda assim entra sem contrato, sem sinal de sucesso e sem acordo de como a tela fala com o resto. A sprint começa. O código também. A pergunta aparece no meio, quando mudar de ideia já custa mais.

Vou seguir essa feature o post inteiro. É curta, todo mundo já viu uma parecida, e nela cabe cada pergunta que eu faço antes de tratar um título como trabalho pronto.

**O processo só fica legível quando uma tela concreta responde por ele.**

## O que queremos resolver

"Colocar um campo de cupom na página" descreve um componente. O problema é outro.

A pessoa chega no produto com um código na mão: campanha, e-mail, alguém que indicou. Hoje ela só descobre se aquele código vale na hora do checkout. O preço que convenceu na página muda quando a decisão já esfriou. O que a tarefa resolve é **mostrar, no produto, o preço que ela vai pagar** se o código for válido para aquele item.

Se a resposta do refinamento for "porque pediram o campo", a tarefa ainda não existe. O campo é uma hipótese. O problema é a surpresa no preço.

**No cupom, a validação acontece na página do produto, antes do carrinho.**

## O que indica sucesso, e o que indica fracasso

O campo em produção não é sucesso. É publicação.

Para esta feature, sucesso é a pessoa ver o campo, aplicar um código válido e seguir ao carrinho com o preço já rebaixado. Dá para ler duas coisas: a taxa de aplicação válida nas sessões da página, e se quem aplicou segue ao carrinho mais do que quem viu o campo e não usou. Fracasso também tem forma: o campo é ignorado; código inválido, expirado ou fora daquele produto come a sessão; o preço da página não bate com o do carrinho.

O número precisa de um lugar e de alguém que vai olhar, combinados antes da sprint. Deixar a medição para depois do lançamento é decidir no escuro e chamar isso de aprendizado.

**Sem um gráfico que muda quando a feature funciona, não há definição de sucesso. Há uma tela.**

## O contrato com o backend

A API já existe? O que ela precisa receber? O que ela devolve? Isso está escrito fora de uma thread?

No cupom, mandar o código e receber um "ok" não serve a página. Ela precisa do preço novo, do valor do desconto e de um motivo estável quando não aplica: inválido, expirado, produto fora da campanha, código já usado. Sem o motivo, a interface inventa a frase. Sem o preço, a interface calcula, e passam a existir dois preços.

Entra código, produto e canal. A sessão entra só quando o cupom for de uma conta. Sai preço original, preço com desconto e a razão da recusa. Se isso não está documentado, o refinamento inclui sentar com backend e escrever o contrato. O componente não adivinha o JSON.

**Contrato que mora na cabeça de quem implementa é premissa.**

## Página pública, sessão, e quem orquestra

A página do produto é pública. Um cupom de campanha pode ser também: a pessoa cola o código sem login e vê o preço. Cupom preso à conta é outro recorte. Aí a sessão entra, e o estado "entre para usar este código" faz parte da tarefa.

Bater direto na API funciona quando existe um endpoint feito para essa tela, com esse retorno, e sem segredo no browser. Preço, elegibilidade e carrinho costumam viver em serviços diferentes. Juntar os três no cliente transforma a página em integradora: três loadings, três erros, uma composição que ninguém desenhou.

Quando a tela depende de mais de um serviço, eu quero um [BFF](/posts/bff-vantagens-e-desvantagens), ou o adaptador que o time já opera, devolvendo o modelo da página. Se a rota não existe, ela entra no refinamento. "O front consome as APIs que já tem" não deixa a tarefa pronta.

**Neste exemplo: página pública, cupom de campanha sem login, um contrato só para a tela. Cupom de conta fica de fora, nomeado.**

## A porta da sprint e a saída

Essas respostas fecham duas coisas que cabem na mesma conversa e não são a mesma lista.

O **DoR** (Definition of Ready) é a porta. Com o time, a tarefa só entra na sprint quando dá para responder:

- O que queremos resolver, separado da forma da solução?
- O que indica sucesso, o que indica fracasso, e onde isso será lido?
- A API existe? O que recebe, o que devolve, e onde está escrito?
- A página é pública? Precisa de sessão? A tela chama um contrato ou reúne várias chamadas?

Sem resposta, fica de fora. Pode entrar com a lacuna escrita e um dono, quando o time aceita o risco de propósito.

O **DoD** (Definition of Done) é a saída, e nasce dessas mesmas respostas. A tarefa está pronta quando a tela cumpre o contrato, o preço e o motivo aparecem como combinado, produto reconhece os estados, o lançamento segue o plano e o sinal de sucesso está sendo coletado. O refinamento escreve esse done antes do código, para o desenvolvimento ter com o que comparar.

**Pergunta repetida vira DoR. Resposta escrita vira DoD.**

## Dentro da sprint: branch e o olhar de produto

One-shot serve ao que é pequeno de verdade: um texto, um token, um ajuste que não abre estado. Cupom na página do produto mexe em preço, vazio, loading, erro e no que vai ser medido. Vai de branch de feature.

A validação com produto acontece no meio, por estado, não na demo do fim. Campo vazio. Código válido. Inválido. Expirado. Produto fora da campanha. A chamada que não responde. Produto olha a tela e compara com o que o refinamento descreveu. A fatia seguinte espera essa ainda ser a feature combinada. Um desconto quase certo, com preço diferente do contrato, aparece aqui.

**O combinado é um estado visível por vez.**

## O lançamento também se desenha

Implementar não encerra a tarefa.

Teste A/B cabe quando a hipótese é "o campo na página muda a ida ao carrinho" e o time pode esperar o sinal. Subir direto cabe quando a data da campanha é o requisito: não ter o campo naquele dia já é o fracasso, e o teste atrasaria a promessa. As duas são decisões.

Os indicadores do refinamento precisam estar no evento antes de abrir a feature. Aplicou, recusou, motivo, seguiu ao carrinho. Gráfico que nasce depois da publicação perde a primeira semana.

Observabilidade cobre o que o desenho não previu. Erro da rota do cupom. Resposta de sucesso com o preço igual ao original. Cupom aceito na página e recusado no carrinho. Comportamento diferente para quem está logado e para quem não está. Um alerta nesse caminho mostra o plano incompleto enquanto ainda dá para corrigir, antes do suporte virar o lugar onde a métrica aparece.

**Abrir a feature sem o sinal e sem o alerta é publicar a tela e largar a pergunta que justificou a sprint.**

## Em produção, o plano vira acompanhamento

Publicou. As decisões já foram tomadas. O que resta é olhar o que a gente disse que olharia.

Sucesso é o sinal andar no sentido combinado, com o erro dentro do aceitável. Fracasso é o campo no ar e o gráfico parado, o erro comendo a sessão, ou o preço da página descolado do carrinho. Os dois pedem outra volta: uma frase mais clara, o campo em outro ponto da página, uma regra que o refinamento não fez. Essa volta não abre um título novo. É a mesma tarefa, com a pergunta mais estreita. O DoR dela já vem do que a produção mostrou.

**A feature no ar é a primeira vez em que sucesso e fracasso deixam de ser opinião.**

## O que fica para a próxima

O cupom foi o fio. O hábito é a pergunta.

Uma tarefa entra quando a gente sabe o que está resolvendo, como vai reconhecer que deu certo ou errado, o que a API promete e como a tela chega nessa promessa. Ela sai quando isso está em produção e alguém lê o sinal. No meio, produto vê estado por estado, e o lançamento — A/B ou direto — é escolha.

**Título a gente já tem no começo do ciclo. Tarefa é o que sobra depois das perguntas.**
