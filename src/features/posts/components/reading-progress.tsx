'use client'

import { useEffect, useRef } from 'react'
import styles from './reading-progress.module.scss'

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let frame = 0

    const update = () => {
      frame = 0
      paint(bar)
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    window.visualViewport?.addEventListener('resize', requestUpdate)
    window.visualViewport?.addEventListener('scroll', requestUpdate)

    const article = bar.closest('article')
    const content = article?.querySelector('[data-reading-progress]')
    const observer = new ResizeObserver(requestUpdate)

    if (article) observer.observe(article)
    if (content) observer.observe(content)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.visualViewport?.removeEventListener('resize', requestUpdate)
      window.visualViewport?.removeEventListener('scroll', requestUpdate)
      observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={barRef}
      className={styles.bar}
      role="progressbar"
      aria-label="Progresso de leitura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    />
  )
}

function paint(bar: HTMLElement) {
  const progress = readingProgress(bar)
  const value = progress === null ? 0 : Math.round(progress * 100)
  const visible = progress !== null && progress > 0

  bar.style.width = `${(progress ?? 0) * 100}%`
  bar.style.opacity = visible ? '1' : '0'

  if (visible) bar.removeAttribute('aria-hidden')
  else bar.setAttribute('aria-hidden', 'true')

  if (bar.getAttribute('aria-valuenow') !== String(value)) {
    bar.setAttribute('aria-valuenow', String(value))
  }
}

// 0 when the article meets the top of the viewport, 1 when the end of the
// text meets the bottom. Null when the text already fits on screen.
function readingProgress(bar: HTMLElement) {
  const article = bar.closest('article')
  const content = article?.querySelector('[data-reading-progress]')

  if (!(article instanceof HTMLElement) || !(content instanceof HTMLElement)) {
    return null
  }

  const articleTop = article.getBoundingClientRect().top + window.scrollY
  const contentBottom = content.getBoundingClientRect().bottom + window.scrollY
  const range = contentBottom - articleTop - window.innerHeight

  if (range <= 0) return null

  return clamp((window.scrollY - articleTop) / range, 0, 1)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
