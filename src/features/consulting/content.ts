import { site } from '@/config/site'

const whatsapp = {
  e164: '5567996096006',
  display: '+55 67 99609-6006',
  label: 'Quero saber mais',
  message: `Olá, Gabriel. Vim pelo site.
Quero melhorar o front-end do projeto.
O que a IA já gerou: `,
} as const

export const consulting = {
  path: site.consulting.path,
  title: site.consulting.title,
  description: site.consulting.description,
  cover: {
    src: '/imgs/consultoria/consultoria.webp',
    social: '/imgs/consultoria/consultoria.jpg',
    width: 1200,
    height: 281,
    alt: 'OpenAI, Claude e Gemini convergem num fluxo só, até um traço mint.',
  },
  promise: 'Um front-end com IA, pronto para as próximas features.',
  audience:
    'Para times que constroem a interface com IA e querem uma base estável para continuar.',
  mechanism:
    'A geração acelera a entrega. **O trabalho é deixar esse código compreensível, observável e pronto para a feature seguinte.**',
  proof:
    'Senior Front-end há 16 anos, em arquitetura e padronização. Passei pelo Grupo Boticário, na evolução do e-commerce, e pelo Grupo SBF, no painel de backoffice, cross-team.',
  howHeading: 'Como funciona',
  steps: [
    'Entendo qual feature merece atenção. Em geral é a que trava a próxima entrega, ou a que a IA já gerou e o time precisa continuar.',
    'Analiso o que ela deveria estar fazendo: o comportamento da interface e o que o time precisa conseguir manter.',
    'Olho o código e defino boas práticas e padrões de front-end. A feature ganha um caminho claro para a próxima mudança.',
    'Adiciono ou melhoro a camada de observabilidade. Dá para ver quando a feature falha e se o padrão segurou.',
    'Deixo a feature como exemplo. As melhorias seguintes e as features novas partem desse padrão.',
  ],
  whatsapp,
} as const
