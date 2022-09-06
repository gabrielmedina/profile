import * as amplitude from '@amplitude/analytics-browser'

amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_KEY!, undefined, {
  attribution: {
    trackNewCampaigns: true,
  }
})

export const logger = ({
  track(event: string, properties?: any) {
    amplitude.track(event, properties)
  }
})
