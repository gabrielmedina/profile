'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

type TrackPageViewProps = {
  event: string
  properties?: Record<string, string>
}

export function TrackPageView({ event, properties }: TrackPageViewProps) {
  const serialized = JSON.stringify(properties ?? {})

  useEffect(() => {
    track(event, JSON.parse(serialized) as Record<string, string>)
  }, [event, serialized])

  return null
}
