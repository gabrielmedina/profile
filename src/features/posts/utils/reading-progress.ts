export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

// 0 when the top of the measured range meets the top of the viewport,
// 1 when its bottom meets the bottom. Null when that box already fits.
export function readingProgressRatio(input: {
  rangeTop: number
  rangeHeight: number
  scrollY: number
  viewportHeight: number
}) {
  const distance = input.rangeHeight - input.viewportHeight

  if (distance <= 0) return null

  return clamp((input.scrollY - input.rangeTop) / distance, 0, 1)
}

export function readingProgressFromBar(bar: HTMLElement) {
  const range = bar
    .closest('article')
    ?.querySelector('[data-reading-progress-range]')

  if (!(range instanceof HTMLElement)) return null

  const rect = range.getBoundingClientRect()

  return readingProgressRatio({
    rangeTop: rect.top + window.scrollY,
    rangeHeight: rect.height,
    scrollY: window.scrollY,
    viewportHeight: window.innerHeight,
  })
}
