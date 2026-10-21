'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
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

const ignoredErrors = new Set(['interrupted', 'canceled'])

function subscribeSpeechSupport() {
  return () => {}
}

function speechSupported() {
  return (
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance === 'function'
  )
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
  const [status, setStatus] = useState<SpeechStatus>('idle')
  const [notice, setNotice] = useState('')
  const statusRef = useRef<SpeechStatus>('idle')
  const generation = useRef(0)
  const startTimer = useRef<number | null>(null)
  const utterances = useRef<SpeechSynthesisUtterance[]>([])

  useEffect(() => {
    if (!speechSupported()) return

    const synth = window.speechSynthesis
    const warmVoices = () => {
      synth.getVoices()
    }

    warmVoices()
    synth.addEventListener('voiceschanged', warmVoices)

    return () => {
      synth.removeEventListener('voiceschanged', warmVoices)
      clearStartTimer()
      generation.current += 1
      utterances.current = []
      synth.cancel()
    }
  }, [])

  useEffect(() => {
    if (status !== 'playing') return

    const id = window.setInterval(() => {
      const synth = getSynth()
      if (synth?.speaking && !synth.paused) synth.resume()
    }, 10000)

    return () => window.clearInterval(id)
  }, [status])

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

  function queue(chunks: string[], generationId: number) {
    const synth = window.speechSynthesis
    const voice = voiceFor(lang)
    const queued: SpeechSynthesisUtterance[] = []

    for (const [index, text] of chunks.entries()) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      if (voice instanceof SpeechSynthesisVoice) utterance.voice = voice

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

  function begin(fromStart: boolean) {
    const synth = getSynth()
    const chunks = speechChunks({ title, description, content })

    if (!synth) {
      setNotice('Não foi possível ler este post neste navegador.')
      return
    }

    if (chunks.length === 0) return

    clearStartTimer()
    const wasBusy = synth.speaking || synth.pending || synth.paused
    const generationId = ++generation.current

    utterances.current = []
    setNotice('')
    updateStatus('playing')

    if (fromStart) track('played-post-audio', { post: title, slug })

    const start = () => {
      if (generation.current !== generationId) return
      if (statusRef.current !== 'playing') return
      queue(chunks, generationId)
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

    begin(false)
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

  return (
    <div
      className={styles.controls}
      role="group"
      aria-label="Leitura em voz alta"
    >
      {status === 'idle' ? (
        <button
          type="button"
          className={styles.button}
          onClick={() => begin(true)}
        >
          Ouvir
        </button>
      ) : (
        <>
          <button
            type="button"
            className={styles.button}
            aria-pressed={status === 'playing'}
            onClick={() => (status === 'playing' ? pause() : resume())}
          >
            {status === 'playing' ? 'Pausar' : 'Continuar'}
          </button>
          <button type="button" className={styles.button} onClick={stop}>
            Parar
          </button>
        </>
      )}
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

function getSynth() {
  if (typeof window === 'undefined' || !speechSupported()) return null

  return window.speechSynthesis
}

function voiceFor(lang: string) {
  const voices = window.speechSynthesis.getVoices()
  const target = normalizeLang(lang)
  const prefix = target.split('-')[0] ?? target

  return (
    voices.find((voice) => normalizeLang(voice.lang) === target) ??
    voices.find((voice) => normalizeLang(voice.lang).startsWith(prefix)) ??
    null
  )
}

function normalizeLang(lang: string) {
  return lang.toLowerCase().replaceAll('_', '-')
}
