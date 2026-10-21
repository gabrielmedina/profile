'use client'

import { init, track as amplitudeTrack } from '@amplitude/analytics-browser'

const amplitudeKey = process.env.NEXT_PUBLIC_AMPLITUDE_KEY
let initialized = false

function setup() {
  if (initialized || typeof window === 'undefined') return

  initialized = true

  if (process.env.NODE_ENV === 'production' && amplitudeKey) {
    init(amplitudeKey)
  }
}

export function track(event: string, properties?: Record<string, string>) {
  setup()

  if (process.env.NODE_ENV !== 'production' || !amplitudeKey) {
    console.info(`[analytics] ${event}`, properties ?? {})
    return
  }

  amplitudeTrack(event, properties)
}
