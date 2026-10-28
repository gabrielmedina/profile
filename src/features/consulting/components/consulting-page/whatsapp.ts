export function whatsappHref(e164: string, message: string) {
  const digits = e164.replace(/\D/g, '')

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
