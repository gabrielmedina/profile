import { jsonForScript } from '@/lib/json-for-script'

type PageViewProps = {
  event: string
  properties?: Record<string, string>
}

export function PageView({ event, properties }: PageViewProps) {
  return (
    <script
      type="application/json"
      data-page-view={event}
      dangerouslySetInnerHTML={{ __html: jsonForScript(properties ?? {}) }}
    />
  )
}
