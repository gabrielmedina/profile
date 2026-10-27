const LEADING_COVER = /^(?:[ \t]*\r?\n)*!\[[^\]]*]\([^)\s]+\)[ \t]*(?:\r?\n|$)/

export function splitLeadingCover(markdown: string) {
  const match = LEADING_COVER.exec(markdown)
  if (!match) return null

  return {
    cover: match[0].trim(),
    body: markdown.slice(match[0].length).replace(/^(?:[ \t]*\r?\n)+/, ''),
  }
}
