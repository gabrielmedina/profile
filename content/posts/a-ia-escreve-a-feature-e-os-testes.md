---
title: 'A IA escreve a feature. Como garantir os testes necessários?'
description: 'Sim, a IA também escreve os testes. O que segura a qualidade não é o prompt: é o contrato de aceite, o gate no CI e a revisão do que foi assertado.'
keys: 'Front-end, Software Engineering, IA, Testes'
image: /imgs/posts/a-ia-escreve-a-feature-e-os-testes.jpg
slug: a-ia-escreve-a-feature-e-os-testes
lang: pt-BR
date: '2026-10-29'
---

![Capa: feature à esquerda passa por um portão de verificação com check; três nós de teste se abrem à direita.](/imgs/posts/a-ia-escreve-a-feature-e-os-testes.webp)

A pergunta aparece em quase toda sessão: **como garantir que a IA está criando os testes necessários para a feature?**

E quase sempre vem com um parêntese honesto: *sim, eu sei que você usa ela para escrevê-los*.

Esse parêntese é o ponto. Se o mesmo modelo escreve a implementação e a suíte, “pedir mais testes” no prompt não é garantia. É volume. Volume sem contrato vira espelho: o teste confirma o que o código já faz, inclusive o bug elegante.

**Na minha opinião, a garantia não mora na IA. Mora no processo que a cerca.**

## 1. O teste que só repete a implementação não protege

Quando a feature e o teste nascem no mesmo fôlego, o modelo tende a assertar o caminho feliz que ele mesmo inventou. Passa no CI. Não prova o comportamento que o produto pediu.

O risco não é “teste gerado por IA”. É teste sem intenção independente: sem caso de borda, sem falha esperada, sem o “o que não pode acontecer”.

Antes de contar arquivos `*.test.ts`, vale perguntar: *se eu quebrar a regra de negócio de propósito, algum teste cai?*

**Se a resposta for não, você não tem cobertura. Tem documentação executável da implementação atual.**

## 2. O aceite escrito vem antes do assert

No mesmo espírito do [spec-driven](/posts/a-ia-fica-perto-quando-a-decisao-esta-escrita): a decisão precisa existir fora da cabeça da sessão.

Para feature com IA, isso significa critérios de aceite testáveis antes (ou no mesmo PR, mas como contrato, não como afterthought):

- o que a tela / a função deve fazer;
- o que deve recusar;
- o estado inicial e o resultado observável;
- o que fica de fora deste recorte.

O modelo recebe o contrato e implementa. O teste aponta para o contrato — não para o diff. Se o aceite mudou, a spec muda. Se só o código mudou, o teste vermelho é o sinal certo.

**Sem isso, “gere os testes” pede à IA que invente o requisito de novo, com outras palavras.**

## 3. Falta de teste precisa falhar de verdade

Garantia operacional é gate, não boa vontade.

Algumas âncoras que funcionam no dia a dia:

- Definition of Done com teste no mesmo PR da regra pura (`utils/`, hooks de domínio, parsers, schemas). Sem arquivo de teste, a feature não está pronta — mesmo com UI linda no preview.
- CI que executa a suíte e bloqueia merge. Prompt cumprido e pipeline vermelho não entregam.
- Cobertura onde a regra mora, não no componente de apresentação inteiro. Extrair a regra para função pura torna o teste barato e revisável — e deixa a IA com um alvo claro, sem arrastar o React junto.
- Checklist de review: “quais asserts cobrem o aceite?” — não “quantos testes a IA gerou?”.

**A IA acelera o preenchimento. O gate decide se aquilo conta.**

## 4. Revisar o que foi assertado — não só se o arquivo existe

Code review de teste gerado por IA tem um foco específico.

Olho para:

- nomes e casos alinhados ao aceite (não `should work` / `renders correctly`);
- falhas explícitas (input inválido, estado vazio, permissão negada);
- mocks honestos — mock demais esconde o contrato; mock de menos acopla o teste ao mundo;
- ausência do caminho que dói (timezone, locale, lista vazia, corrida de estado, erro de rede).

Se o teste só monta o componente e procura um texto na tela, ele documenta o markup. Raramente documenta a regra.

**A pergunta útil na review: este assert me avisaria se o produto quebrasse do jeito que o usuário sente?**

## 5. Às vezes, separar quem escreve o teste

Sim, eu uso IA para escrever testes. Uso com critério.

Quando a regra é crítica — dinheiro, permissão, dado na borda, parsing que já quebrou em produção — vale descasar um pouco a autoria:

- escrever o esqueleto do teste (ou o aceite executável) antes da implementação;
- pedir a suíte numa sessão com o contrato e sem colar a solução completa;
- ou revisar os asserts como se fossem código de produto, não anexo da feature.

**Não é teatro de pureza. É reduzir a chance do espelho.** A IA continua na mesa. Só deixa de ser a única testemunha do próprio trabalho.

## O principal aprendizado?

**Você não garante testes necessários pedindo à IA que “não esqueça os testes”. Garante quando o aceite está escrito, o CI falha sem a suíte, e alguém revisa o que foi assertado — mesmo que a mesma IA tenha digitado o arquivo.**

A ferramenta escreve rápido. O contrato diz o que “necessário” significa. O gate impede o atalho. A review segura o espelho.

No fim, o parêntese continua verdadeiro: ela também escreve os testes. O que muda é quem define o que conta como teste de verdade.
