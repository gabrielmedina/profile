'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { track } from '@/lib/analytics'
import { speechChunks } from '../speech-text'
import styles from './post-speech.module.scss'

type PostSpeechProps = {
  title: string
  description: string
  content: string
  lang: string
  slug: string
}

type SpeechStatus = 'idle' | 'playing' | 'paused'

type Rate = (typeof RATES)[number]

const RATES = [0.75, 1, 1.25, 1.5] as const
const RATE_KEY = 'post-speech-rate'
const VOICE_KEY = 'post-speech-voice'
const ignoredErrors = new Set(['interrupted', 'canceled'])
const preferenceListeners = new Set<() => void>()

function subscribeSpeechSupport() {
  return () => {}
}

function speechSupported() {
  return (
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance === 'function'
  )
}

function subscribePreferences(listener: () => void) {
  preferenceListeners.add(listener)
  return () => preferenceListeners.delete(listener)
}

function emitPreferences() {
  for (const listener of preferenceListeners) listener()
}

function storedRate(): Rate {
  const value = Number(localStorage.getItem(RATE_KEY))
  return RATES.find((rate) => rate === value) ?? 1
}

function storedVoice() {
  return localStorage.getItem(VOICE_KEY) ?? ''
}

function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }

  emitPreferences()
}

export function PostSpeech({
  title,
  description,
  content,
  lang,
  slug,
}: PostSpeechProps) {
  const supported = useSyncExternalStore(
    subscribeSpeechSupport,
    speechSupported,
    () => true,
  )
  const rate = useSyncExternalStore(subscribePreferences, storedRate, () => 1)
  const voiceUri = useSyncExternalStore(
    subscribePreferences,
    storedVoice,
    () => '',
  )
  const [status, setStatus] = useState<SpeechStatus>('idle')
  const [notice, setNotice] = useState('')
  const [open, setOpen] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const statusRef = useRef<SpeechStatus>('idle')
  const generation = useRef(0)
  const startTimer = useRef<number | null>(null)
  const utterances = useRef<SpeechSynthesisUtterance[]>([])
  const chunkIndex = useRef(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const rateLabelId = useId()
  const voiceId = useId()
  const panelId = useId()

  useEffect(() => {
    if (!speechSupported()) return

    const synth = window.speechSynthesis
    const updateVoices = () => setVoices(orderedVoices(synth, lang))
    const frame = window.requestAnimationFrame(updateVoices)

    synth.addEventListener('voiceschanged', updateVoices)
    synth.getVoices()

    return () => {
      window.cancelAnimationFrame(frame)
      synth.removeEventListener('voiceschanged', updateVoices)
      if (startTimer.current !== null) {
        window.clearTimeout(startTimer.current)
        startTimer.current = null
      }
      generation.current += 1
      utterances.current = []
      synth.cancel()
    }
  }, [lang])

  useEffect(() => {
    if (status !== 'playing') return

    const id = window.setInterval(() => {
      const synth = getSynth()
      if (synth?.speaking && !synth.paused) synth.resume()
    }, 10000)

    return () => window.clearInterval(id)
  }, [status])

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function updateStatus(next: SpeechStatus) {
    statusRef.current = next
    setStatus(next)
  }

  function clearStartTimer() {
    if (startTimer.current === null) return

    window.clearTimeout(startTimer.current)
    startTimer.current = null
  }

  function fail(synth: SpeechSynthesis, error = '') {
    generation.current += 1
    clearStartTimer()
    utterances.current = []
    synth.cancel()
    updateStatus('idle')
    setNotice(
      error === 'not-allowed'
        ? 'O navegador bloqueou a leitura. Tente ouvir de novo.'
        : 'Não foi possível ler este post neste navegador.',
    )
  }

  function queue(chunks: string[], generationId: number, startIndex: number) {
    const synth = window.speechSynthesis
    const selected = voiceByUri(storedVoice())
    const voice = selected ?? voiceFor(lang)
    const queued: SpeechSynthesisUtterance[] = []

    for (const [index, text] of chunks.entries()) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = voice instanceof SpeechSynthesisVoice ? voice.lang : lang
      utterance.rate = storedRate()
      if (voice instanceof SpeechSynthesisVoice) utterance.voice = voice

      utterance.onstart = () => {
        if (generation.current !== generationId) return
        chunkIndex.current = startIndex + index
      }

      utterance.onend = () => {
        if (generation.current !== generationId) return
        if (index === chunks.length - 1) updateStatus('idle')
      }

      utterance.onerror = (event) => {
        if (generation.current !== generationId) return
        if (ignoredErrors.has(event.error)) return
        fail(synth, event.error)
      }

      queued.push(utterance)

      try {
        synth.speak(utterance)
      } catch {
        fail(synth)
        return
      }
    }

    utterances.current = queued
  }

  function begin(fromStart: boolean, startIndex = 0) {
    const synth = getSynth()
    const chunks = speechChunks({ title, description, content }).slice(
      startIndex,
    )

    if (!synth) {
      setNotice('Não foi possível ler este post neste navegador.')
      return
    }

    if (chunks.length === 0) return

    clearStartTimer()
    const wasBusy = synth.speaking || synth.pending || synth.paused
    const generationId = ++generation.current

    utterances.current = []
    chunkIndex.current = startIndex
    setNotice('')
    updateStatus('playing')

    if (fromStart) track('played-post-audio', { post: title, slug })

    const start = () => {
      if (generation.current !== generationId) return
      if (statusRef.current !== 'playing') return
      queue(chunks, generationId, startIndex)
    }

    if (!wasBusy) {
      start()
      return
    }

    // Chrome ignores speak() in the same turn as cancel().
    synth.cancel()
    startTimer.current = window.setTimeout(() => {
      startTimer.current = null
      start()
    }, 60)
  }

  function chooseRate(next: Rate) {
    remember(RATE_KEY, String(next))
    if (statusRef.current !== 'idle') begin(false, chunkIndex.current)
  }

  function chooseVoice(next: string) {
    remember(VOICE_KEY, next)
    if (statusRef.current !== 'idle') begin(false, chunkIndex.current)
  }

  function pause() {
    const synth = getSynth()
    if (!synth) return

    synth.pause()
    updateStatus('paused')
  }

  function resume() {
    const synth = getSynth()
    if (!synth) return

    if (synth.paused) {
      updateStatus('playing')
      synth.resume()
      return
    }

    if (synth.speaking || synth.pending) {
      updateStatus('playing')
      return
    }

    begin(false, chunkIndex.current)
  }

  function stop() {
    generation.current += 1
    clearStartTimer()
    utterances.current = []
    getSynth()?.cancel()
    setNotice('')
    updateStatus('idle')
  }

  if (!supported) return null

  const playLabel =
    status === 'playing'
      ? 'Pausar a leitura'
      : status === 'paused'
        ? 'Continuar a leitura'
        : 'Ouvir este post'

  return (
    <div
      ref={rootRef}
      className={styles.controls}
      role="group"
      aria-label="Leitura em voz alta"
    >
      <button
        type="button"
        className={styles.iconButton}
        aria-label={playLabel}
        aria-pressed={status === 'playing'}
        onClick={() => {
          if (status === 'playing') pause()
          else if (status === 'paused') resume()
          else begin(true)
        }}
      >
        {status === 'playing' ? <PauseIcon /> : <PlayIcon />}
      </button>
      {status !== 'idle' ? (
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Parar a leitura"
          onClick={stop}
        >
          <StopIcon />
        </button>
      ) : null}
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Opções de voz e velocidade"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <SlidersIcon />
      </button>
      {open ? (
        <div className={styles.panel} id={panelId}>
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
                aria-pressed={option === rate}
                onClick={() => chooseRate(option)}
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
            value={
              voices.some((voice) => voice.voiceURI === voiceUri)
                ? voiceUri
                : ''
            }
            onChange={(event) => chooseVoice(event.target.value)}
          >
            <option value="">Padrão do navegador</option>
            {voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <span className={notice ? styles.notice : styles.live} role="status">
        {notice ||
          (status === 'playing'
            ? 'Lendo o post'
            : status === 'paused'
              ? 'Leitura pausada'
              : '')}
      </span>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.15 2.35c-.62-.38-1.4.07-1.4.8v9.7c0 .73.78 1.18 1.4.8l8.05-4.85c.6-.36.6-1.24 0-1.6L4.15 2.35z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
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

function getSynth() {
  if (typeof window === 'undefined' || !speechSupported()) return null

  return window.speechSynthesis
}

function orderedVoices(synth: SpeechSynthesis, lang: string) {
  const target = normalizeLang(lang)
  const prefix = target.split('-')[0] ?? target

  return [...synth.getVoices()].sort((left, right) => {
    const score = (voice: SpeechSynthesisVoice) => {
      const code = normalizeLang(voice.lang)
      if (code === target) return 0
      if (code.startsWith(prefix)) return 1
      return 2
    }

    return (
      score(left) - score(right) || left.name.localeCompare(right.name, lang)
    )
  })
}

function voiceFor(lang: string) {
  return orderedVoices(window.speechSynthesis, lang)[0] ?? null
}

function voiceByUri(uri: string) {
  if (!uri) return null

  return (
    window.speechSynthesis
      .getVoices()
      .find((voice) => voice.voiceURI === uri) ?? null
  )
}

function normalizeLang(lang: string) {
  return lang.toLowerCase().replaceAll('_', '-')
}

function formatRate(rate: number) {
  return `${rate.toLocaleString('pt-BR')}×`
}
