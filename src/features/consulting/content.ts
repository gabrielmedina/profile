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
  alt: 'Capa: uma linha reta na primeira metade e, a partir do meio, uma subida em mint até o fim.',
} as const

const whatsapp = {
  e164: '5567996096006',
  display: '+55 67 99609-6006',
} as const

export const consulting = {
  path: site.consulting.path,
  title: site.consulting.title,
  description: site.consulting.description,
  subtitle: 'O que muda na carreira e na empresa.',
  intro:
    'Na carreira, o critério fica mais firme e o próximo passo deixa de ser um chute. Na empresa, o time sai da mesma dor e passa a entregar com mais acerto.',
  experience: {
    heading: 'Por que a minha consultoria?',
    statement: 'Dev front-end sênior, com 16 anos de experiência.',
    note: 'Especializado em arquitetura, padronização e entregas que acertam, com impacto no produto.',
    milestones: [
      {
        value: 'Agência W3',
        caption:
          'Criação de produtos digitais, do zero. Interface, fluxo e a entrega com o cliente na mesa.',
        focus: false,
      },
      {
        value: 'Grupo VFX',
        caption:
          'Evolução da plataforma de e-learning. O aluno precisava achar o próximo passo, e o produto precisava aguentar conteúdo e uso real.',
        focus: false,
      },
      {
        value: 'Quero Educação',
        caption:
          'Evolução do e-commerce de bolsa de estudos. A oferta fica clara, e a compra termina sem a pessoa se perder.',
        focus: false,
      },
      {
        value: 'EmCasa',
        caption:
          'Evolução do e-commerce de imóveis. Anúncio, busca e a decisão de compra no mesmo caminho.',
        focus: false,
      },
      {
        value: 'Grupo Boticário',
        caption:
          'Especialista na evolução do e-commerce. Arquitetura, padrão entre os times e entregas que mudam o que a pessoa vê e compra na loja.',
        focus: true,
      },
      {
        value: 'Grupo SBF',
        caption:
          'Referência cross-team no painel de backoffice. Cada squad chega com outro contexto. O trabalho é entender a dor, alinhar a arquitetura e acompanhar até a entrega.',
        focus: true,
      },
    ],
  },
  deliveryHeading: 'Como começar',
  deliveryLead:
    'Dois formatos. Os dois olham o momento e terminam com um plano escrito.',
  offers: [
    {
      id: 'individual',
      slug: 'individual',
      title: 'Consultoria individual',
      summary:
        'Para uma pessoa. Um encontro de 75 minutos e um plano para as próximas quatro semanas.',
      steps: [
        'Você conta o momento, o que trava, e manda um material real: um projeto, uma pull request, ou uma decisão que está na sua mão.',
        'No encontro a gente confirma onde você está, olha o material e escolhe um próximo passo que cabe nas próximas semanas.',
        'Em até três dias você recebe o plano: onde está, o que trava, uma meta, três passos, e como perceber que andou.',
      ],
      groups: [
        {
          prices: [
            { label: 'Encontro e plano', display: 'R$ 320', value: 320 },
          ],
        },
        {
          intro:
            'Para quem já tem o plano: quatro encontros semanais de 45 minutos.',
          prices: [
            { label: 'Quatro encontros', display: 'R$ 640', value: 640 },
          ],
        },
      ],
      note: 'Pix antes de marcar. Dá para reagendar uma vez, avisando com um dia.',
      boundary:
        'O plano é o que você leva. Os quatro encontros são a continuação, para quem já tem esse plano.',
      whatsappLabel: 'Chamar no WhatsApp',
      whatsappMessage: `Olá, Gabriel. Vim pelo site e quero uma consultoria individual.
Meu momento hoje: `,
    },
    {
      id: 'company',
      slug: 'empresarial',
      title: 'Consultoria empresarial',
      summary:
        'Para um time. Uma sessão em volta de uma dor e um plano de 30 e 60 dias.',
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
      whatsappMessage: `Olá, Gabriel. Vim pelo site e quero uma consultoria empresarial.
A dor que queremos olhar:
Quantas pessoas entrariam na sessão: `,
    },
  ],
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
