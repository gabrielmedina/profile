import { site } from '@/config/site'

const whatsapp = {
  e164: '5567996096006',
  display: '+55 67 99609-6006',
  label: 'Chamar no WhatsApp',
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
    alt: 'Barras soltas à esquerda seguem por uma linha até um traço mint.',
  },
  promise: 'Um front-end com IA, pronto para as próximas features.',
  audience:
    'Para times que constroem a interface com IA e querem uma base estável para continuar.',
  mechanism:
    'A geração acelera a entrega. **O trabalho é deixar esse código compreensível, observável e pronto para a feature seguinte.**',
  proof:
    '16 anos de front-end. Grupo Boticário, na evolução do e-commerce. Grupo SBF, no painel de backoffice, cross-team.',
  workHeading: 'O trabalho',
  work: [
    'Eu entendo o que já foi gerado e onde o código aperta: gargalos, problemas de manutenção e o que impede a próxima feature de nascer com segurança.',
    'A partir disso, proponho padrões e melhorias. As features ficam com observabilidade, padronizadas e operando com fluidez. **O front-end sai otimizado e bem estruturado, uma base para o que ainda vai ser construído.**',
  ],
  ask: 'Quer melhorar o front-end do seu projeto?',
  whatsapp,
} as const
