import { init, track } from '@amplitude/analytics-browser'

const isProduction = process.env.NODE_ENV === 'production'
const isClient = typeof window !== undefined

if (isProduction && isClient) {
  init(process.env.NEXT_PUBLIC_AMPLITUDE_KEY ?? '')
}

export const logger = {
  track(event: string, properties?: unknown) {
    if (isProduction) {
      if (isClient) track(event, properties ?? {})
    } else {
      // eslint-disable-next-line no-console
      console.log(`Amplitude: ${event}`, properties)
    }
  },
}
