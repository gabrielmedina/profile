export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

// 0 when the article meets the top of the viewport, 1 when the end of the
// text meets the bottom. Null when the text already fits on screen.
export function readingProgressRatio(input: {
  articleTop: number
  contentBottom: number
  scrollY: number
  viewportHeight: number
}) {
  const range = input.contentBottom - input.articleTop - input.viewportHeight

  if (range <= 0) return null

  return clamp((input.scrollY - input.articleTop) / range, 0, 1)
}

export function readingProgressFromBar(bar: HTMLElement) {
  const article = bar.closest('article')
  const content = article?.querySelector('[data-reading-progress]')

  if (!(article instanceof HTMLElement) || !(content instanceof HTMLElement)) {
    return null
  }

  return readingProgressRatio({
    articleTop: article.getBoundingClientRect().top + window.scrollY,
    contentBottom: content.getBoundingClientRect().bottom + window.scrollY,
    scrollY: window.scrollY,
    viewportHeight: window.innerHeight,
  })
}
