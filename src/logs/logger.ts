import * as amplitude from '@amplitude/analytics-browser'

const isProduction = process.env.NODE_ENV === 'production'
const isClient = typeof window !== undefined

if (isProduction && isClient) {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_KEY ?? '')
}

export const logger = {
  track(event: string, properties?: unknown) {
    if (isProduction) {
      if (isClient) amplitude.track(event, properties ?? {})
    } else {
      // eslint-disable-next-line no-console
      console.log(`Amplitude: ${event}`, properties)
    }
  },
}