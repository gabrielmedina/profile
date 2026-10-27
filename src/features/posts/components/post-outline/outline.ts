import { uniqueHeadingId } from '@/components/markdown/heading-id'

export type OutlineSection = {
  id: string
  text: string
  children: OutlineSection[]
}

const HEADING = /^ {0,3}(#{2,6})[ \t]+(.*)$/
const FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/

// Same h2–h6 pass as the markdown renderer, outside fences, so each href
// matches the heading id on the page.
export function articleOutline(markdown: string): OutlineSection[] | null {
  const usedIds = new Map<string, number>()
  const sections: OutlineSection[] = []
  let parent: OutlineSection | null = null
  let fence: { marker: string; length: number } | null = null

  for (const raw of markdown.split('\n')) {
    const line = raw.replace(/\r$/, '')

    if (fence) {
      const close = FENCE.exec(line)
      if (
        close &&
        close[1][0] === fence.marker &&
        close[1].length >= fence.length &&
        close[2].trim() === ''
      ) {
        fence = null
      }
      continue
    }

    const opened = FENCE.exec(line)
    if (opened && (opened[1][0] === '~' || !opened[2].includes('`'))) {
      fence = { marker: opened[1][0], length: opened[1].length }
      continue
    }

    const heading = HEADING.exec(line)
    if (!heading) continue

    const depth = heading[1].length
    const text = headingPlainText(stripClosingHashes(heading[2]))
    const id = uniqueHeadingId(text, usedIds)
    if (!text) continue

    const section: OutlineSection = { id, text, children: [] }

    if (depth === 2 || !parent) {
      sections.push(section)
      if (depth === 2) parent = section
      continue
    }

    parent.children.push(section)
  }

  const count = sections.reduce(
    (total, section) => total + 1 + section.children.length,
    0,
  )

  return count >= 2 ? sections : null
}

function stripClosingHashes(value: string) {
  return value.replace(/[ \t]+#+\s*$/, '').trim()
}

function headingPlainText(value: string) {
  const codes: string[] = []
  const withoutCode = value.replace(/`([^`]*)`/g, (_, code: string) => {
    const token = `\u0000${codes.length}\u0000`
    codes.push(code)
    return token
  })

  const plain = withoutCode
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)]\[[^\]]*]/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/(^|\s)_([^_\n]+)_(?=\s|$)/g, '$1$2')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

  return plain.replace(/\u0000(\d+)\u0000/g, (_, index: string) => {
    return codes[Number(index)] ?? ''
  })
}
