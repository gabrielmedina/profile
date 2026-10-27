# 005 — Monetização

**Status:** aceita

## Contexto

O site é um perfil com posts. Três ideias de receita já foram consideradas: anúncio, um agradecimento no estilo “me paga um café”, e um programa de mentoria. A mentoria já aparece no texto `acompanhar-devs-no-dia-a-dia`, como ideia, sem página e sem chamada. O catálogo é curto e o tráfego ainda não justifica rede de anúncio. O site sai como HTML, com um script pequeno, sem SDK de terceiro.

## Decisão

Nenhuma das três entra no produto agora. Ficam para uma onda futura, nesta ordem:

1. **Mentoria.** Página curta, no tom do post, com para quem é, o tamanho (uma pessoa, as próximas semanas), o que acontece e um contato. A navegação continua Home e Posts. O artigo termina completo. Nos posts de liderança técnica, uma frase no fim aponta para a página. No rodapé, uma linha no mesmo nível do feed. Sem widget, popup ou script de agenda. Preço e contato só entram quando existirem de fato.
2. **Café.** Uma frase depois do artigo, antes dos relacionados, com link para fora (Pix). Sem botão flutuante e sem SDK.
3. **Anúncio.** Só quando o tráfego pagar o custo de um script de terceiro e de um banner de consentimento. Um bloco único, abaixo do artigo, numa rede que não rastreia o leitor. Fora do corpo do texto.

## Consequências

- Enquanto o item estiver `depois` no backlog, o site não ganha script de anúncio, widget de doação, item de navegação “Mentoria” nem chamada no meio do artigo.
- A página, a frase do café e o bloco de anúncio só nascem juntos com preço, chave Pix (ou link) e e-mail reais. Sem esses dados, a onda não começa.
- O post `acompanhar-devs-no-dia-a-dia` segue sem oferta até a página existir.
