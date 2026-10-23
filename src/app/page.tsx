import type { Metadata } from 'next'
import { PageView } from '@/components/analytics/page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { site } from '@/config/site'
import { Profile } from '@/features/profile/components/profile/profile'
import { getProfile } from '@/features/profile/services/get-profile'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { profilePageGraph } from '@/lib/seo/schema-graph'

export const metadata: Metadata = pageMetadata({
  description: site.description,
  path: '/',
  kind: 'profile',
})

export default async function HomePage() {
  const profile = await getProfile()

  return (
    <>
      <JsonLd data={profilePageGraph()} />
      <PageView event="opened-home-page" />
      <Profile user={profile.user} content={profile.content} />
    </>
  )
}
