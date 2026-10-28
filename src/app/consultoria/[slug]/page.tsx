import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageView } from '@/components/analytics/page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { site } from '@/config/site'
import { ConsultingOfferPage } from '@/features/consulting/components/consulting-page/consulting-offer'
import {
  consulting,
  consultingCover,
  consultingServices,
  findOffer,
  offerPath,
} from '@/features/consulting/content'
import { noIndexRobots, pageMetadata } from '@/lib/seo/page-metadata'
import { consultingPageGraph } from '@/lib/seo/schema-graph'

type ConsultingOfferRouteProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return consulting.offers.map((offer) => ({ slug: offer.slug }))
}

export async function generateMetadata({
  params,
}: ConsultingOfferRouteProps): Promise<Metadata> {
  const { slug } = await params
  const offer = findOffer(slug)

  if (!offer) {
    return {
      title: site.consulting.title,
      robots: noIndexRobots,
    }
  }

  return pageMetadata({
    title: offer.title,
    description: offer.summary,
    path: offerPath(offer.slug),
    keywords: [offer.title, site.consulting.title],
    image: {
      url: consultingCover.social,
      alt: consultingCover.alt,
      width: consultingCover.width,
      height: consultingCover.height,
    },
  })
}

export default async function ConsultingOfferRoute({
  params,
}: ConsultingOfferRouteProps) {
  const { slug } = await params
  const offer = findOffer(slug)

  if (!offer) notFound()

  const path = offerPath(offer.slug)

  return (
    <>
      <JsonLd
        data={consultingPageGraph({
          title: offer.title,
          description: offer.summary,
          path,
          crumbs: [
            { name: 'Início', path: '/' },
            { name: site.consulting.title, path: site.consulting.path },
            { name: offer.title, path },
          ],
          services: consultingServices().filter(
            (service) => service.path === path,
          ),
        })}
      />
      <PageView
        event="opened-consulting-offer"
        properties={{ offer: offer.id, slug: offer.slug }}
      />
      <ConsultingOfferPage offer={offer} />
    </>
  )
}
