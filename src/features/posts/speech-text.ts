const MAX_CHUNK_LENGTH = 180

type SpeechSource = {
  title: string
  description: string
  content: string
}

export function speechChunks({
  title,
  description,
  content,
}: SpeechSource): string[] {
  const parts = [title, description, ...plainBlocks(content)]

  return parts.flatMap(splitChunk).map(collapseSpace).filter(Boolean)
}

function plainBlocks(markdown: string): string[] {
  const withoutImages = markdown.replace(/!\[[^\]]*]\([^)]*\)/g, '')
  const withoutFences = withoutImages.replace(/```[\s\S]*?```/g, '')

  return withoutFences.split(/\n\s*\n/).flatMap(blockToParts)
}

function blockToParts(block: string): string[] {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const listItem = /^([-*+]|\d+\.)\s+/

  if (lines.length > 1 && lines.every((line) => listItem.test(line))) {
    return lines.map(plainLine)
  }

  return [plainLine(lines.join(' '))]
}

function plainLine(line: string): string {
  return line
    .replace(/^>\s?/, '')
    .replace(/^#{1,6}\s+/, '')
    .replace(/^([-*+]|\d+\.)\s+/, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/(^|\s)_([^_\n]+)_(?=\s|$)/g, '$1$2')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function collapseSpace(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function splitChunk(text: string): string[] {
  const normalized = collapseSpace(text)

  if (!normalized) return []
  if (normalized.length <= MAX_CHUNK_LENGTH) return [normalized]

  const sentences = normalized.split(/(?<=[.!?…])\s+/)
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if (sentence.length > MAX_CHUNK_LENGTH) {
      if (current) chunks.push(current)
      current = ''
      chunks.push(...hardSplit(sentence))
      continue
    }

    const next = current ? `${current} ${sentence}` : sentence

    if (next.length > MAX_CHUNK_LENGTH) {
      if (current) chunks.push(current)
      current = sentence
    } else {
      current = next
    }
  }

  if (current) chunks.push(current)

  return chunks
}

function hardSplit(text: string): string[] {
  const chunks: string[] = []
  let rest = text

  while (rest.length > MAX_CHUNK_LENGTH) {
    const slice = rest.slice(0, MAX_CHUNK_LENGTH + 1)
    const breakAt = slice.lastIndexOf(' ')
    const cut = breakAt > 40 ? breakAt : MAX_CHUNK_LENGTH

    chunks.push(rest.slice(0, cut).trim())
    rest = rest.slice(cut).trim()
  }

  if (rest) chunks.push(rest)

  return chunks
}
