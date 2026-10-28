import { site } from '@/config/site'

const whatsapp = {
  e164: '5567996096006',
  display: '+55 67 99609-6006',
  label: 'Chamar no WhatsApp',
  message: `Olá, Gabriel. Vim pelo site.
O front-end daqui está sendo feito com IA.
O que mais dói hoje: `,
} as const

export const consulting = {
  path: site.consulting.path,
  title: site.consulting.title,
  description: site.consulting.description,
  promise: 'O front-end que a IA escreveu está difícil de manter.',
  audience:
    'Para empresas em que fullstack e back-end estão entregando a interface.',
  mechanism:
    'O código sai rápido. Fica anêmico, falha com facilidade, e custa manter e escalar.',
  proof:
    '16 anos de front-end. Grupo Boticário, na evolução do e-commerce. Grupo SBF, no painel de backoffice, cross-team.',
  workHeading: 'O trabalho',
  work: [
    {
      title: 'Padrões',
      text: 'Defino como o front-end deve ser escrito. Arquitetura, convenção, e o que a próxima geração da IA precisa respeitar.',
    },
    {
      title: 'O que a IA já entregou',
      text: 'Reviso as features feitas com IA. O que fica, o que sai, e o que precisa de outra volta.',
    },
    {
      title: 'Observabilidade',
      text: 'O time passa a ver a falha quando ela acontece, e se o padrão segurou.',
    },
  ],
  startHeading: 'Como começa',
  start:
    'Sem preço fechado. Primeiro eu entendo o problema. Depois sai um plano de evolução e de melhorias.',
  whatsapp,
} as const
