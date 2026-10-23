export async function writeClipboard(value: string) {
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error('clipboard unavailable')

    await navigator.clipboard.writeText(value)
  } catch {
    copyWithCommand(value)
  }
}

function copyWithCommand(value: string) {
  const field = document.createElement('textarea')
  field.value = value
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.left = '-9999px'
  document.body.append(field)
  field.select()

  const copied = document.execCommand('copy')
  field.remove()

  if (!copied) throw new Error('copy failed')
}
