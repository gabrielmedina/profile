import type { Metadata } from 'next'
import { PageView } from '@/components/analytics/page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { site } from '@/config/site'
import { ConsultingPage } from '@/features/consulting/components/consulting-page/consulting-page'
import {
  consultingCover,
  consultingServices,
} from '@/features/consulting/content'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { consultingPageGraph } from '@/lib/seo/schema-graph'

const crumbs = [
  { name: 'Início', path: '/' },
  { name: site.consulting.title, path: site.consulting.path },
]

export const metadata: Metadata = pageMetadata({
  title: site.consulting.title,
  description: site.consulting.description,
  path: site.consulting.path,
  keywords: ['Consultoria', 'Mentoria', 'Front-end', 'Liderança técnica'],
  image: {
    url: consultingCover.social,
    alt: consultingCover.alt,
    width: consultingCover.width,
    height: consultingCover.height,
  },
})

export default function ConsultoriaPage() {
  return (
    <>
      <JsonLd
        data={consultingPageGraph({
          title: site.consulting.title,
          description: site.consulting.description,
          path: site.consulting.path,
          crumbs,
          services: consultingServices(),
        })}
      />
      <PageView event="opened-consulting-page" />
      <ConsultingPage />
    </>
  )
}
