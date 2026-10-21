import { TrackPageView } from '@/components/analytics/track-page-view'
import { getProfile } from '@/features/profile/get-profile'
import { Profile } from '@/features/profile/profile'

export default async function HomePage() {
  const profile = await getProfile()

  return (
    <>
      <TrackPageView event="opened-home-page" />
      <Profile user={profile.user} content={profile.content} />
    </>
  )
}
