import { safeJson } from '@/lib/safe-json'
import { formatRate, RATES, speechRevealScript } from '../speech-chrome'
import { speechChunks } from '../speech-text'
import styles from './post-speech.module.scss'

type PostSpeechProps = {
  title: string
  description: string
  content: string
  lang: string
  slug: string
}

export function PostSpeech({
  title,
  description,
  content,
  lang,
  slug,
}: PostSpeechProps) {
  const panelId = `voz-${slug}`
  const rateLabelId = `velocidade-${slug}`
  const voiceId = `voz-select-${slug}`
  const payload = safeJson({
    title,
    slug,
    lang,
    chunks: speechChunks({ title, description, content }),
  })

  return (
    <>
      <div
        className={styles.controls}
        data-speech
        hidden
        role="group"
        aria-label="Leitura em voz alta"
      >
        <script
          type="application/json"
          data-speech-payload
          dangerouslySetInnerHTML={{ __html: payload }}
        />
        <button
          type="button"
          className={styles.iconButton}
          data-speech-play
          aria-pressed="false"
          aria-label="Ouvir este post"
        >
          <PlayIcon />
          <PauseIcon />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          data-speech-stop
          hidden
          aria-label="Parar a leitura"
        >
          <StopIcon />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          data-speech-options
          aria-expanded="false"
          aria-controls={panelId}
          aria-label="Opções de voz e velocidade"
        >
          <SlidersIcon />
        </button>
        <div className={styles.panel} id={panelId} data-speech-panel hidden>
          <p className={styles.panelLabel} id={rateLabelId}>
            Velocidade
          </p>
          <div
            className={styles.rates}
            role="group"
            aria-labelledby={rateLabelId}
          >
            {RATES.map((option) => (
              <button
                key={option}
                type="button"
                className={styles.rate}
                data-speech-rate={option}
                aria-pressed={option === 1}
              >
                {formatRate(option)}
              </button>
            ))}
          </div>
          <label className={styles.panelLabel} htmlFor={voiceId}>
            Voz
          </label>
          <select
            id={voiceId}
            className={styles.select}
            data-speech-voice
            defaultValue=""
          >
            <option value="">Padrão do navegador</option>
          </select>
        </div>
        <span className={styles.live} data-speech-status role="status" />
      </div>
      <script dangerouslySetInnerHTML={{ __html: speechRevealScript }} />
    </>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" data-icon="play">
      <path d="M4.15 2.35c-.62-.38-1.4.07-1.4.8v9.7c0 .73.78 1.18 1.4.8l8.05-4.85c.6-.36.6-1.24 0-1.6L4.15 2.35z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" data-icon="pause">
      <path d="M3 2.25h3.25v11.5H3V2.25zm6.75 0H13v11.5H9.75V2.25z" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.25 3.25h9.5v9.5h-9.5v-9.5z" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M1.25 3.15h4.3v1.6h-4.3v-1.6zm6.7 0h6.8v1.6h-6.8v-1.6zM4.9 1.75h1.7v4.4H4.9v-4.4zM1.25 11.25h8.3v1.6h-8.3v-1.6zm10.7 0h2.8v1.6h-2.8v-1.6zM9.15 9.85h1.7v4.4h-1.7v-4.4z" />
    </svg>
  )
}
