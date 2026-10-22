'use client'

import { useEffect, useId, useState } from 'react'
import { track } from '@/lib/analytics'
import { linkedInShareUrl, whatsAppShareUrl } from '../share-targets'
import styles from './post-share.module.scss'

type PostShareProps = {
  title: string
  description: string
  slug: string
  url: string
}

export function PostShare({ title, description, slug, url }: PostShareProps) {
  const headingId = useId()
  const [copied, setCopied] = useState(false)
  const [copyAttempt, setCopyAttempt] = useState(0)
  const [error, setError] = useState('')
  const whatsapp = whatsAppShareUrl({ title, description, url })
  const linkedin = linkedInShareUrl(url)

  useEffect(() => {
    if (copyAttempt === 0) return

    const timeout = window.setTimeout(() => setCopied(false), 2400)

    return () => window.clearTimeout(timeout)
  }, [copyAttempt])

  async function copyLink() {
    setError('')

    try {
      await writeClipboard(url)
      setCopied(true)
      setCopyAttempt((attempt) => attempt + 1)
      track('shared-post', { title, slug, channel: 'copy' })
    } catch {
      setCopied(false)
      setError(
        'Não consegui copiar daqui. O endereço continua na barra do navegador.',
      )
    }
  }

  function share(channel: 'whatsapp' | 'linkedin') {
    track('shared-post', { title, slug, channel })
  }

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.title}>
        Leva para a próxima conversa.
      </h2>
      <p className={styles.hint}>
        Se fez sentido aqui, pode fazer sentido para mais alguém.
      </p>
      <ul className={styles.actions}>
        <li>
          <button
            type="button"
            className={
              copied ? `${styles.action} ${styles.copied}` : styles.action
            }
            onClick={copyLink}
          >
            <LinkIcon />
            <span aria-live="polite">
              {copied ? 'Link copiado' : 'Copiar o link'}
            </span>
          </button>
        </li>
        <li>
          <a
            className={styles.action}
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => share('whatsapp')}
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        </li>
        <li>
          <a
            className={styles.action}
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => share('linkedin')}
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        </li>
      </ul>
      {error ? (
        <p className={styles.error} role="status">
          {error}
        </p>
      ) : null}
    </section>
  )
}

async function writeClipboard(value: string) {
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error('clipboard unavailable')

    await navigator.clipboard.writeText(value)
    return
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

function LinkIcon() {
  return (
    <svg className={styles.stroke} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.6 9.4a2.6 2.6 0 0 0 3.7.1l1.5-1.5a2.6 2.6 0 0 0-3.7-3.7L7.1 5.3" />
      <path d="M9.4 6.6a2.6 2.6 0 0 0-3.7-.1L4.2 8a2.6 2.6 0 0 0 3.7 3.7l1-1" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className={styles.fill} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8.05 1.35A6.55 6.55 0 0 0 2.15 11.1l-.85 3.55 3.65-.8a6.55 6.55 0 1 0 3.1-12.5zm3.75 9.25c-.15.45-.95.85-1.35.95-.35.1-.8.15-1.3-.05-.3-.1-.7-.25-1.2-.5-2.05-1.1-3.4-3.55-3.5-3.7-.1-.2-.85-1.15-.85-2.2 0-1.05.55-1.55.75-1.75.2-.2.45-.25.6-.25h.5c.15 0 .35 0 .5.4.15.45.6 1.55.65 1.65.05.1.1.25 0 .4-.1.15-.15.25-.3.4l-.2.25c-.1.1-.2.2-.1.4.15.3.7 1.15 1.55 1.85 1.05.85 1.95 1.1 2.25 1.25.25.1.4.1.5-.05l.6-.7c.15-.2.3-.15.5-.1.2.1 1.35.65 1.55.75.2.1.35.15.4.25.05.25-.05.75-.2 1.2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg className={styles.fill} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.35 6.05H.85v9.15h2.5V6.05zM2.1 1.15C1.25 1.15.55 1.85.55 2.7s.7 1.55 1.55 1.55 1.55-.7 1.55-1.55-.7-1.55-1.55-1.55zM15.15 10.15c0-2.55-1.4-3.75-3.2-3.75-1.45 0-2.1.8-2.45 1.35V6.05H7.05v9.15h2.5v-4.55c0-.25.05-.5.15-.7.2-.5.7-1.05 1.5-1.05 1.05 0 1.45.8 1.45 1.95v4.35h2.5v-4.05z" />
    </svg>
  )
}
