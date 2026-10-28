import { site } from '@/config/site'

export type ConsultingPrice = {
  label: string
  display: string
  value: number
}

export type ConsultingPriceGroup = {
  intro?: string
  prices: readonly ConsultingPrice[]
}

export type ConsultingOffer = {
  id: 'individual' | 'company'
  slug: string
  eyebrow: string
  title: string
  summary: string
  steps: readonly string[]
  groups: readonly ConsultingPriceGroup[]
  note: string
  boundary: string
  whatsappLabel: string
  whatsappMessage: string
}

export const consultingCover = {
  src: '/imgs/consultoria/consultoria.webp',
  social: '/imgs/consultoria/consultoria.jpg',
  width: 1200,
  height: 675,
  alt: 'Capa: uma lâmina fosca ao centro. Um nó à esquerda e três nós à direita ligam-se a ela por fios mint.',
} as const

const whatsapp = {
  e164: '5567996096006',
  display: '+55 67 99609-6006',
} as const

export const consulting = {
  path: site.consulting.path,
  title: site.consulting.title,
  description: site.consulting.description,
  subtitle: 'Um plano para quem desenvolve. Um plano para a dor de um time.',
  intro:
    'Sou Gabriel Medina, senior front-end engineer. Há mais de 16 anos trabalho com web, e há mais de 8 com React. Passei pelo Grupo Boticário, em plataformas de e-commerce, e hoje atuo no Grupo SBF como referência técnica entre times.',
  experience: {
    heading: 'Experiência',
    body: 'O que eu levo para a conversa é critério. Arquitetura, design system, a fronteira de um sistema, e o que fazer com o que a IA devolveu.',
    items: [
      'Mais de 16 anos em desenvolvimento web, e mais de 8 com React, TypeScript e Next.js.',
      'Arquitetura de front-end, design systems e microfrontends.',
      'Grupo Boticário: evolução de plataformas de e-commerce.',
      'Grupo SBF: referência técnica entre squads, da concepção da solução até a entrega.',
    ],
  },
  deliveryHeading: 'O que eu entrego',
  offers: [
    {
      id: 'individual',
      slug: 'leitura-de-carreira',
      eyebrow: 'Para uma pessoa',
      title: 'Leitura de carreira',
      summary:
        'Para dev júnior ou pleno. Um encontro de 75 minutos e um plano escrito para as próximas quatro semanas.',
      steps: [
        'Você conta o momento, o que trava, e manda um material real: um projeto, uma pull request, ou uma decisão que está na sua mão.',
        'No encontro a gente confirma onde você está, olha o material e escolhe um próximo passo que cabe nas próximas semanas.',
        'Em até três dias você recebe o plano: onde está, o que trava, uma meta, três passos, e como perceber que andou.',
      ],
      groups: [
        {
          prices: [
            { label: 'Júnior', display: 'R$ 320', value: 320 },
            { label: 'Pleno', display: 'R$ 520', value: 520 },
          ],
        },
        {
          intro:
            'Para quem já tem o plano: quatro encontros semanais de 45 minutos.',
          prices: [
            { label: 'Júnior', display: 'R$ 640', value: 640 },
            { label: 'Pleno', display: 'R$ 960', value: 960 },
          ],
        },
      ],
      note: 'Pix antes de marcar. Dá para reagendar uma vez, avisando com um dia.',
      boundary:
        'O plano é o que você leva. Os quatro encontros são a continuação, para quem já tem esse plano.',
      whatsappLabel: 'Chamar no WhatsApp',
      whatsappMessage: `Olá, Gabriel. Vim pelo site e quero uma leitura de carreira.
Sou júnior ou pleno:
Meu momento hoje: `,
    },
    {
      id: 'company',
      slug: 'para-um-time',
      eyebrow: 'Para um time',
      title: 'Consultoria para uma dor',
      summary:
        'Para um time de engenharia. Vocês chegam com uma dor já dita. Eu olho com o grupo e devolvo um plano de 30 e 60 dias. Quem executa é o time.',
      steps: [
        'Uma página de combinado: a dor em uma frase, quem entra na sala, dois exemplos concretos enviados com cinco dias de antecedência, e o que fica de fora.',
        'Quarenta e cinco minutos com quem patrocina, para entender a restrição e o que “melhor” significa.',
        'Sessão de 2h30 com 6 a 12 pessoas. A gente corrige o que eu entendi, olha os exemplos e rascunha três movimentos, com dono do lado de vocês.',
        'Em até cinco dias úteis, o plano: a dor no dia a dia, a causa, o que não mudar agora, as ações com ordem e dono, e os sinais de que funcionou. Uma call de 30 minutos entrega o texto.',
      ],
      groups: [
        {
          prices: [
            { label: 'Um time, uma dor', display: 'R$ 8.000', value: 8000 },
            {
              label: 'A mesma dor em mais de um time',
              display: 'R$ 12.000',
              value: 12000,
            },
            {
              label: 'Retorno de 90 minutos, 30 dias depois',
              display: 'R$ 2.500',
              value: 2500,
            },
          ],
        },
      ],
      note: 'Metade ao fechar a data, metade na entrega do plano.',
      boundary:
        'O time executa. Eu entrego a sessão e o plano. Outra dor é outro contrato.',
      whatsappLabel: 'Chamar no WhatsApp',
      whatsappMessage: `Olá, Gabriel. Vim pelo site e quero uma consultoria para o time.
A dor que queremos olhar:
Quantas pessoas entrariam na sessão: `,
    },
  ],
  scope: {
    heading: 'O tamanho do trabalho',
    items: [
      'Na leitura, o plano é o que você leva. Os quatro encontros são a continuação, para quem já tem esse plano.',
      'Na consultoria, o time executa. Eu entrego a sessão e o plano.',
      'Cada contrato olha uma dor. Outra dor é outro contrato.',
    ],
  },
  whatsapp,
} as const

export function offerPath(slug: string) {
  return `${consulting.path}/${slug}`
}

export function findOffer(slug: string) {
  return consulting.offers.find((offer) => offer.slug === slug)
}

export function consultingServices() {
  return consulting.offers.map((offer) => ({
    name: offer.title,
    description: offer.summary,
    path: offerPath(offer.slug),
    prices: offer.groups.flatMap((group) =>
      group.prices.map((price) => ({
        name: `${offer.title}: ${price.label}`,
        price: price.value,
      })),
    ),
  }))
}
