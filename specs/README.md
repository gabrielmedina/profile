# Spec Driven Development

Decisões de arquitetura e produto deste site vivem em `specs/`. Código novo e refatorações devem seguir uma spec existente ou abrir/atualizar uma antes de expandir o escopo.

## Como usamos

1. **Ler** a spec relevante antes de mudar estrutura, SEO, imagens ou fronteiras de componente.
2. **Atualizar a spec** quando a decisão mudar — o código não é a única fonte da verdade.
3. **Marcar itens no backlog** (`backlog.md`) ao descobrir melhorias; implementar em ondas pequenas.
4. **Preferir mudanças simples e performáticas**: menos JS no cliente, HTML semântico, assets leves.
5. **Validar no preview da Vercel**, não com walkthrough/feedback no Cursor — o agente entrega no PR.

## Índice

| Spec                                                         | Tema                             |
| ------------------------------------------------------------ | -------------------------------- |
| [001-architecture.md](./001-architecture.md)                 | Pastas, nomes e hierarquia       |
| [002-component-boundaries.md](./002-component-boundaries.md) | Apresentação vs domínio          |
| [003-posts-seo.md](./003-posts-seo.md)                       | Publicações, SEO e HTML5         |
| [004-images.md](./004-images.md)                             | Imagens leves e `next/image`     |
| [005-monetization.md](./005-monetization.md)                 | Consultoria, café e anúncio      |
| [backlog.md](./backlog.md)                                   | Melhorias identificadas e status |

## Formato de uma spec

Cada spec documenta:

- **Contexto** — o problema ou tensionamento
- **Decisão** — o que adotamos
- **Consequências** — o que passa a ser permitido / proibido
- **Status** — `aceita` | `proposta` | `substituída`

Specs não substituem o `AGENTS.md` nem o `README.md`: o README orienta quem chega ao repo; o `AGENTS.md` resume convenções operacionais para agentes; as specs detalham o _porquê_ e o contrato.
