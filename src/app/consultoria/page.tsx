import type { Metadata } from 'next'
import { PageView } from '@/components/analytics/page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { site } from '@/config/site'
import { ConsultingPage } from '@/features/consulting/components/consulting-page/consulting-page'
import { consulting } from '@/features/consulting/content'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { consultingPageGraph } from '@/lib/seo/schema-graph'

export const metadata: Metadata = pageMetadata({
  title: site.consulting.title,
  description: site.consulting.description,
  path: site.consulting.path,
  keywords: ['Consultoria', 'Mentoria', 'Front-end', 'Liderança técnica'],
})

export default function ConsultoriaPage() {
  return (
    <>
      <JsonLd
        data={consultingPageGraph(
          consulting.offers.map((offer) => ({
            name: offer.title,
            description: offer.summary,
            prices: offer.groups.flatMap((group) =>
              group.prices.map((price) => ({
                name: `${offer.title}: ${price.label}`,
                price: price.value,
              })),
            ),
          })),
        )}
      />
      <PageView event="opened-consulting-page" />
      <ConsultingPage />
    </>
  )
}
