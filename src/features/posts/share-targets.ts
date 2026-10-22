type ShareInput = {
  title: string
  description: string
  url: string
}

export function whatsAppShareUrl({ title, description, url }: ShareInput) {
  const text = `Achei que você ia gostar.\n\n${title}\n\n${description}\n\n${url}`

  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function linkedInShareUrl(url: string) {
  const share = new URL('https://www.linkedin.com/sharing/share-offsite/')
  share.searchParams.set('url', url)

  return share.toString()
}
