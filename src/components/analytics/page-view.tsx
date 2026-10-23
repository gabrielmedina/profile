import { safeJson } from '@/lib/safe-json'

type PageViewProps = {
  event: string
  properties?: Record<string, string>
}

export function PageView({ event, properties }: PageViewProps) {
  return (
    <script
      type="application/json"
      data-page-view={event}
      dangerouslySetInnerHTML={{ __html: safeJson(properties ?? {}) }}
    />
  )
}
