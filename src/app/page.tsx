import type { Metadata } from 'next'
import { PageView } from '@/components/analytics/page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { getProfile } from '@/features/profile/get-profile'
import { Profile } from '@/features/profile/profile'
import { pageMetadata } from '@/lib/metadata'
import { site } from '@/lib/site'
import { profilePageGraph } from '@/lib/structured-data'

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
