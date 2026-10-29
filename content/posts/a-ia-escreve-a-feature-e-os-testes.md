---
title: 'A IA escreve a feature. Como garantir os testes necessários?'
description: 'Se a IA entra na feature — e, às vezes, na suíte —, o que segura a qualidade não é o prompt: é o contrato de aceite, o gate no CI e a revisão do que foi assertado.'
keys: 'Front-end, Software Engineering, IA, Testes'
image: /imgs/posts/a-ia-escreve-a-feature-e-os-testes.jpg
slug: a-ia-escreve-a-feature-e-os-testes
lang: pt-BR
date: '2026-10-29'
---

![Capa: feature à esquerda passa por um portão de verificação com check; três nós de teste se abrem à direita.](/imgs/posts/a-ia-escreve-a-feature-e-os-testes.webp)

Se você usa IA para implementar uma feature, uma pergunta tende a aparecer cedo: **como garantir que os testes necessários também entram — e que eles de fato protegem o que importa?**

Em alguns fluxos, a mesma ferramenta que sugere o código também sugere a suíte. Em outros, o teste continua 100% humano. Os dois caminhos cabem. O que muda é o risco: quando implementação e asserts nascem juntos, sem um contrato à parte, fica fácil gerar volume que só espelha o que o código já faz — inclusive o bug elegante.

**Na minha opinião, a garantia não mora na ferramenta. Mora no processo que a cerca.**

## 1. O teste que só repete a implementação não protege

Quando feature e teste nascem no mesmo fôlego — com IA ou sem —, o caminho feliz da implementação costuma virar o caminho feliz do assert. Passa no CI. Não prova o comportamento que o produto pediu.

O risco não é “teste gerado por IA”. É teste sem intenção independente: sem caso de borda, sem falha esperada, sem o “o que não pode acontecer”.

Antes de contar arquivos `*.test.ts`, vale perguntar: *se eu quebrar a regra de negócio de propósito, algum teste cai?*

**Se a resposta for não, você não tem cobertura. Tem documentação executável da implementação atual.**

## 2. O aceite escrito vem antes do assert

No mesmo espírito do [spec-driven](/posts/a-ia-fica-perto-quando-a-decisao-esta-escrita): a decisão precisa existir fora da cabeça de quem (ou do que) está implementando.

Se a IA entra na feature, isso fica ainda mais útil: critérios de aceite testáveis antes (ou no mesmo PR, mas como contrato, não como afterthought):

- o que a tela / a função deve fazer;
- o que deve recusar;
- o estado inicial e o resultado observável;
- o que fica de fora deste recorte.

O teste aponta para o contrato — não para o diff. Se o aceite mudou, a spec muda. Se só o código mudou, o teste vermelho é o sinal certo.

**Sem isso, pedir “gere os testes” — à IA ou a quem for — vira inventar o requisito de novo, com outras palavras.**

## 3. Falta de teste precisa falhar de verdade

Garantia operacional é gate, não boa vontade.

Algumas âncoras que funcionam no dia a dia:

- Definition of Done com teste no mesmo PR da regra pura (`utils/`, hooks de domínio, parsers, schemas). Sem arquivo de teste, a feature não está pronta — mesmo com UI linda no preview.
- CI que executa a suíte e bloqueia merge. Prompt cumprido e pipeline vermelho não entregam.
- Cobertura onde a regra mora, não no componente de apresentação inteiro. Extrair a regra para função pura torna o teste barato e revisável — e, se a IA estiver no fluxo, deixa um alvo claro, sem arrastar o React junto.
- Checklist de review: “quais asserts cobrem o aceite?” — não “quantos arquivos de teste entraram no PR?”.

**A ferramenta pode acelerar o preenchimento. O gate decide se aquilo conta.**

## 4. Revisar o que foi assertado — não só se o arquivo existe

Code review de teste — gerado, sugerido ou escrito à mão — tem um foco específico.

Olho para:

- nomes e casos alinhados ao aceite (não `should work` / `renders correctly`);
- falhas explícitas (input inválido, estado vazio, permissão negada);
- mocks honestos — mock demais esconde o contrato; mock de menos acopla o teste ao mundo;
- ausência do caminho que dói (timezone, locale, lista vazia, corrida de estado, erro de rede).

Se o teste só monta o componente e procura um texto na tela, ele documenta o markup. Raramente documenta a regra.

**A pergunta útil na review: este assert me avisaria se o produto quebrasse do jeito que o usuário sente?**

## 5. Às vezes, separar quem escreve o teste

Se a mesma sessão (ou a mesma pessoa, no mesmo fôlego) escreve a feature e a suíte, o espelho fica tentador. Em regras críticas — dinheiro, permissão, dado na borda, parsing que já quebrou em produção — vale descasar um pouco a autoria:

- escrever o esqueleto do teste (ou o aceite executável) antes da implementação;
- se você usa IA na suíte, pedir os asserts com o contrato e sem colar a solução completa;
- ou revisar os asserts como se fossem código de produto, não anexo da feature.

**Não é teatro de pureza. É reduzir a chance do espelho.** A ferramenta pode continuar na mesa. Só não precisa ser a única testemunha do próprio trabalho.

## O principal aprendizado?

**Você não garante testes necessários pedindo que “não esqueçam os testes”. Garante quando o aceite está escrito, o CI falha sem a suíte, e alguém revisa o que foi assertado — mesmo que a IA tenha ajudado a digitar o arquivo.**

Se a IA entra no fluxo, ela escreve rápido. O contrato diz o que “necessário” significa. O gate impede o atalho. A review segura o espelho.

O que muda, no fim, não é se a ferramenta participou. É quem define o que conta como teste de verdade.
