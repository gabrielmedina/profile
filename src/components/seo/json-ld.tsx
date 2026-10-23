import { jsonForScript } from '@/lib/json-for-script'

type JsonLdProps = {
  data: unknown
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonForScript(data) }}
    />
  )
}
