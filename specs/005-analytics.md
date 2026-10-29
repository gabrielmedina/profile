# 005 — Eventos, funis e Amplitude

**Status:** aceita

## Contexto

O site já envia eventos à HTTP API do Amplitude, sem SDK. O volume não estava a serviço de uma pergunta: `prefers-color-theme` saía em toda página, cada evento era um POST, o clique no card não dizia de onde vinha e não havia evento de fim de leitura. Sem isso não dá para montar o funil “acessou o post → leu até o final”, nem separar clique da lista e do continue lendo, nem ler compartilhamento por canal.

## Decisão

O catálogo abaixo é a lista de eventos do produto. Nome novo entra aqui antes de ir para o HTML. Propriedades são strings. O funil segura `slug` entre os passos, então o mesmo nome de propriedade aparece nos dois eventos.

### Catálogo

| Evento                    | Quando                                         | Propriedades                 |
| ------------------------- | ---------------------------------------------- | ---------------------------- |
| `opened-home-page`        | carga de `/`                                   | —                            |
| `opened-posts-page`       | carga de `/posts`                              | —                            |
| `opened-subject-page`     | carga de `/assuntos/[slug]`                    | `subject`, `slug`            |
| `opened-post-page`        | carga de `/posts/[slug]`                       | `post`, `slug`               |
| `finished-reading-post`   | fim do artigo, uma vez por visita              | `post`, `slug`, `completion` |
| `clicked-post-item`       | clique no card                                 | `title`, `slug`, `surface`   |
| `shared-post`             | compartilhamento                               | `title`, `slug`, `channel`   |
| `clicked-subject`         | assunto no filtro ou no rodapé do post         | `title`, `slug`              |
| `clicked-nav-link`        | item da navegação                              | `title`                      |
| `clicked-article-outline` | item do guia “Neste artigo”                    | `title`, `slug`              |
| `played-post-audio`       | ouvir o post desde o início                    | `post`, `slug`               |
| `changed-theme`           | a pessoa troca o tema                          | `theme`                      |
| `prefers-color-theme`     | preferência do sistema, só quando o valor muda | `theme`                      |

`surface` é `list` ou `continue-reading`. `list` cobre a listagem em `/posts` e em `/assuntos/[slug]`: as duas são o `PostList`. `continue-reading` é só o bloco “Continue lendo” no fim do artigo.

`channel` é `copy`, `whatsapp` ou `linkedin`. `copy` só dispara depois que a área de transferência aceita o link. WhatsApp e LinkedIn disparam no clique que abre o destino.

`completion` é `scrolled` ou `visible`. `scrolled` é o fim do trecho do artigo, a mesma caixa da barra de progresso, quando faltam no máximo 8px para o fim da viewport. `visible` é o artigo inteiro já cabendo na viewport, depois de `load` e das fontes, com altura de layout maior que zero. Os dois contam como “leu até o final”: num post curto o final já está na tela. O evento não repete na mesma visita.

### Funil

**Leitura do post.** Funnel no Amplitude, ordem “this order”, janela de 1 dia, contagem de uniques.

1. `opened-post-page`
2. `finished-reading-post`

Holding constant: `slug`. Sem isso, abrir o post A e terminar o post B conta como conversão.

O passo 1 é a visita, não o clique. Quem chega por busca ou por um link compartilhado entra no funil do mesmo jeito.

### Métricas

Não são funis. São event segmentation, totais e uniques.

- **Cliques em posts:** `clicked-post-item`, group by `surface`. Group by `slug` mostra qual post foi clicado. `list` é a lista; `continue-reading` é o continue lendo.
- **Compartilhamento:** `shared-post`, group by `channel`.

Um funil opcional, se fizer falta, é `clicked-post-item` filtrado por `surface` → `opened-post-page`, também com holding constant `slug`. Ele responde “o clique nessa superfície abriu esse post”. O funil de leitura continua sendo o de cima.

### Envio

Continua a HTTP API (`api2.amplitude.com/2/httpapi`), sem SDK, só em produção, com a chave `NEXT_PUBLIC_AMPLITUDE_KEY`. Sem chave, o evento vai para o console.

A fila junta os eventos e manda um POST por segundo de silêncio. `pagehide` e a aba escondida esvaziam a fila com `keepalive`, para um clique que navega não perder o evento. Cada item guarda o próprio `time`; o `event_id` cresce dentro do lote.

`prefers-color-theme` deixa de sair em toda página. O valor fica no `localStorage` da identidade (`site-analytics`) e o evento só volta quando a preferência do sistema muda. `changed-theme` continua em cada troca feita pela pessoa.

Opt-out do cookie antigo do Amplitude segue valendo: sem `device_id`, nada é enviado.

### Dispositivo e origem

Cada evento leva `platform: "Web"`, `language`, `ip: "$remote"` e `user_agent`. O país sai do IP do request. A device family sai do user agent. Desktop sem modelo no user agent continua `(none)`; celular passa a ter família. `platform` fica `Web`: celular e desktop não são outra plataforma.

Não mandar `os_name`. O Amplitude preenche o OS com o navegador lido do user agent. Um `os_name` explícito, sem os outros campos de device, zera a device family.

A origem usa os mesmos nomes do Browser SDK. No evento, entram só os campos presentes nesta carga: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `referrer`, `referring_domain` e os click ids (`gclid`, `fbclid`, `dclid`, `gbraid`, `wbraid`, `msclkid`, `ttclid`, `twclid`, `ko_click_id`, `li_fat_id`, `rdt_cid`). Propriedade declarada no evento ganha do campo de campanha. Navegação interna leva o referrer do próprio site no evento.

Quando a campanha é nova, o mesmo POST começa com `$identify`, no mesmo `time` do primeiro evento do lote e com `event_id` menor. `$setOnce` grava `initial_*`; sem valor, a string é `EMPTY`. `$set` grava o toque atual e `$unset` tira o que essa carga não trouxe. Campanha nova é sessão nova com origem diferente, ou mudança de UTM, click id ou domínio do referrer. O próprio domínio não é origem nova e não apaga o toque anterior. Tráfego direto no meio da sessão também não. A última campanha fica em `site-analytics-campaign`; se esse registro não existe, vale o cookie `AMP_MKTG_` que o SDK deixou.

## Como salvar no Amplitude

O gráfico salvo pede a secret key do projeto. A chave do browser, a que vai no HTML, não cria gráfico nem taxonomia. Com a secret key, em Create → Chart:

1. **Funnel** “Leitura do post”: eventos `opened-post-page` → `finished-reading-post`, this order, conversion window 1 day, hold property constant `slug`.
2. **Event Segmentation** “Cliques em posts”: `clicked-post-item`, group by `surface`.
3. **Event Segmentation** “Compartilhamentos”: `shared-post`, group by `channel`.

Os tipos de evento passam a existir no projeto quando o primeiro evento real chega. Não enviar evento de teste para a chave de produção.

## Consequências

- Card de post declara `surface` no `PostItem`. A lista passa `list`; o continue lendo passa `continue-reading`. Os dois mandam `slug`.
- O fim da leitura é calculado em `public/site.js`, na mesma medida da barra. O slug e o título vão em `data-reading-slug` e `data-reading-title` na barra. Sem `'use client'`.
- Não criar evento paralelo para a mesma pergunta (`post_opened`, `read_complete`). O histórico já usa os nomes desta tabela.
- Não voltar a disparar `prefers-color-theme` por page view.
- Não reintroduzir o SDK do Amplitude para esses gráficos.
- Não mandar `os_name` manual, nem trocar `platform` de `Web` para o sistema do celular.
- Não tratar o domínio do próprio site como origem nova. A origem que permanece no usuário é a do `$identify`.
