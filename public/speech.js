var RATE_KEY = 'post-speech-rate'
var VOICE_KEY = 'post-speech-voice'
var RATES = [0.75, 1, 1.25, 1.5]
var players = new Set()
var byRoot = new WeakMap()
var listening = false

export function handle(root, event) {
  var player = ensure(root)
  var target = event.target
  if (!player || !target || !target.closest) return

  if (target.closest('[data-speech-play]')) {
    if (player.status === 'playing') pause(player)
    else if (player.status === 'paused') resume(player)
    else begin(player, true, 0)
    return
  }

  if (target.closest('[data-speech-stop]')) {
    stop(player)
    return
  }

  if (target.closest('[data-speech-options]')) {
    player.open = !player.open
    render(player)
    if (player.open) loadVoices(player)
    return
  }

  var rateButton = target.closest('[data-speech-rate]')
  if (rateButton) chooseRate(player, Number(rateButton.getAttribute('data-speech-rate')))
}

function ensure(root) {
  var existing = byRoot.get(root)
  if (existing) return existing

  var payloadNode = root.querySelector('[data-speech-payload]')
  var payload

  try {
    payload = JSON.parse((payloadNode && payloadNode.textContent) || '{}')
  } catch (error) {
    return null
  }

  if (!payload || !Array.isArray(payload.chunks)) return null

  var player = {
    root: root,
    payload: payload,
    status: 'idle',
    notice: '',
    open: false,
    generation: 0,
    startTimer: null,
    chunkIndex: 0,
    resumeTimer: null,
    voicesBound: false,
  }

  byRoot.set(root, player)
  players.add(player)
  listen()
  syncRates(player)

  var select = root.querySelector('[data-speech-voice]')
  if (select) {
    select.addEventListener('change', function () {
      chooseVoice(player, select.value)
    })
  }

  return player
}

function listen() {
  if (listening) return
  listening = true

  document.addEventListener('pointerdown', function (event) {
    players.forEach(function (player) {
      if (!player.open || player.root.contains(event.target)) return
      player.open = false
      render(player)
    })
  })

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return
    players.forEach(function (player) {
      if (!player.open) return
      player.open = false
      render(player)
    })
  })

  window.addEventListener('pagehide', function () {
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  })
}

function render(player) {
  var root = player.root
  var play = root.querySelector('[data-speech-play]')
  var stop = root.querySelector('[data-speech-stop]')
  var options = root.querySelector('[data-speech-options]')
  var panel = root.querySelector('[data-speech-panel]')
  var status = root.querySelector('[data-speech-status]')
  var playing = player.status === 'playing'
  var paused = player.status === 'paused'

  if (play) {
    play.setAttribute('aria-pressed', playing ? 'true' : 'false')
    play.setAttribute(
      'aria-label',
      playing
        ? 'Pausar a leitura'
        : paused
          ? 'Continuar a leitura'
          : 'Ouvir este post',
    )
  }

  if (stop) stop.hidden = player.status === 'idle'
  if (options) options.setAttribute('aria-expanded', player.open ? 'true' : 'false')
  if (panel) panel.hidden = !player.open

  if (status) {
    var text =
      player.notice ||
      (playing ? 'Lendo o post' : paused ? 'Leitura pausada' : '')
    status.textContent = text
    if (player.notice) status.setAttribute('data-notice', 'true')
    else status.removeAttribute('data-notice')
  }
}

function begin(player, fromStart, startIndex) {
  var synth = getSynth()
  var chunks = player.payload.chunks.slice(startIndex)

  if (!synth) {
    player.notice = 'Não foi possível ler este post neste navegador.'
    render(player)
    return
  }

  if (chunks.length === 0) return

  clearStartTimer(player)
  var wasBusy = synth.speaking || synth.pending || synth.paused
  var generationId = ++player.generation
  player.chunkIndex = startIndex
  player.notice = ''
  updateStatus(player, 'playing')

  if (fromStart && window.__site && window.__site.track) {
    window.__site.track('played-post-audio', {
      post: player.payload.title,
      slug: player.payload.slug,
    })
  }

  var start = function () {
    if (player.generation !== generationId) return
    if (player.status !== 'playing') return
    queue(player, chunks, generationId, startIndex)
  }

  if (!wasBusy) {
    start()
    return
  }

  // Chrome ignores speak() in the same turn as cancel().
  synth.cancel()
  player.startTimer = window.setTimeout(function () {
    player.startTimer = null
    start()
  }, 60)
}

function queue(player, chunks, generationId, startIndex) {
  var synth = window.speechSynthesis
  var lang = player.payload.lang
  var selected = voiceByUri(readVoice())
  var voice = selected || voiceFor(lang)

  for (var index = 0; index < chunks.length; index += 1) {
    if (!speakChunk(player, synth, chunks, index, voice, lang, generationId, startIndex)) {
      return
    }
  }
}

function speakChunk(player, synth, chunks, index, voice, lang, generationId, startIndex) {
  var utterance = new SpeechSynthesisUtterance(chunks[index])
  utterance.lang = voice instanceof SpeechSynthesisVoice ? voice.lang : lang
  utterance.rate = readRate()
  if (voice instanceof SpeechSynthesisVoice) utterance.voice = voice

  utterance.onstart = function () {
    if (player.generation !== generationId) return
    player.chunkIndex = startIndex + index
  }

  utterance.onend = function () {
    if (player.generation !== generationId) return
    if (index === chunks.length - 1) updateStatus(player, 'idle')
  }

  utterance.onerror = function (event) {
    if (player.generation !== generationId) return
    if (event.error === 'interrupted' || event.error === 'canceled') return
    fail(player, event.error)
  }

  try {
    synth.speak(utterance)
    return true
  } catch (error) {
    fail(player)
    return false
  }
}

function chooseRate(player, next) {
  if (RATES.indexOf(next) === -1) return
  remember(RATE_KEY, String(next))
  syncRates(player)
  if (player.status !== 'idle') begin(player, false, player.chunkIndex)
}

function chooseVoice(player, next) {
  remember(VOICE_KEY, next)
  if (player.status !== 'idle') begin(player, false, player.chunkIndex)
}

function pause(player) {
  var synth = getSynth()
  if (!synth) return
  synth.pause()
  updateStatus(player, 'paused')
}

function resume(player) {
  var synth = getSynth()
  if (!synth) return

  if (synth.paused) {
    updateStatus(player, 'playing')
    synth.resume()
    return
  }

  if (synth.speaking || synth.pending) {
    updateStatus(player, 'playing')
    return
  }

  begin(player, false, player.chunkIndex)
}

function stop(player) {
  player.generation += 1
  clearStartTimer(player)
  var synth = getSynth()
  if (synth) synth.cancel()
  player.notice = ''
  updateStatus(player, 'idle')
}

function fail(player, error) {
  var synth = getSynth()
  player.generation += 1
  clearStartTimer(player)
  if (synth) synth.cancel()
  player.notice =
    error === 'not-allowed'
      ? 'O navegador bloqueou a leitura. Tente ouvir de novo.'
      : 'Não foi possível ler este post neste navegador.'
  updateStatus(player, 'idle')
}

function updateStatus(player, next) {
  player.status = next
  render(player)

  if (next === 'playing') startResume(player)
  else stopResume(player)
}

function startResume(player) {
  if (player.resumeTimer !== null) return

  player.resumeTimer = window.setInterval(function () {
    var synth = getSynth()
    if (synth && synth.speaking && !synth.paused) synth.resume()
  }, 10000)
}

function stopResume(player) {
  if (player.resumeTimer === null) return
  window.clearInterval(player.resumeTimer)
  player.resumeTimer = null
}

function clearStartTimer(player) {
  if (player.startTimer === null) return
  window.clearTimeout(player.startTimer)
  player.startTimer = null
}

function syncRates(player) {
  var rate = readRate()
  var buttons = player.root.querySelectorAll('[data-speech-rate]')

  for (var index = 0; index < buttons.length; index += 1) {
    var button = buttons[index]
    var pressed = Number(button.getAttribute('data-speech-rate')) === rate
    button.setAttribute('aria-pressed', pressed ? 'true' : 'false')
  }
}

function loadVoices(player) {
  var synth = getSynth()
  var select = player.root.querySelector('[data-speech-voice]')
  if (!synth || !select) return

  var apply = function () {
    var voices = orderedVoices(synth, player.payload.lang)
    var options = select.querySelectorAll('[data-voice]')
    for (var index = 0; index < options.length; index += 1) options[index].remove()

    for (var voiceIndex = 0; voiceIndex < voices.length; voiceIndex += 1) {
      var voice = voices[voiceIndex]
      var option = document.createElement('option')
      option.value = voice.voiceURI
      option.textContent = voice.name + ' (' + voice.lang + ')'
      option.setAttribute('data-voice', '')
      select.append(option)
    }

    var stored = readVoice()
    select.value = voices.some(function (voice) {
      return voice.voiceURI === stored
    })
      ? stored
      : ''
  }

  if (!player.voicesBound) {
    player.voicesBound = true
    synth.addEventListener('voiceschanged', apply)
  }

  apply()
  synth.getVoices()
}

function getSynth() {
  var synth = window.speechSynthesis
  if (
    !synth ||
    typeof synth.speak !== 'function' ||
    typeof SpeechSynthesisUtterance !== 'function'
  ) {
    return null
  }

  return synth
}

function orderedVoices(synth, lang) {
  var target = normalizeLang(lang)
  var prefix = target.split('-')[0] || target

  return synth.getVoices().slice().sort(function (left, right) {
    var score = function (voice) {
      var code = normalizeLang(voice.lang)
      if (code === target) return 0
      if (code.indexOf(prefix) === 0) return 1
      return 2
    }

    return score(left) - score(right) || left.name.localeCompare(right.name, lang)
  })
}

function voiceFor(lang) {
  var synth = window.speechSynthesis
  if (!synth) return null
  return orderedVoices(synth, lang)[0] || null
}

function voiceByUri(uri) {
  if (!uri || !window.speechSynthesis) return null

  return (
    window.speechSynthesis.getVoices().find(function (voice) {
      return voice.voiceURI === uri
    }) || null
  )
}

function normalizeLang(lang) {
  return String(lang || '').toLowerCase().replace(/_/g, '-')
}

function readRate() {
  try {
    var value = Number(localStorage.getItem(RATE_KEY))
    return RATES.indexOf(value) === -1 ? 1 : value
  } catch (error) {
    return 1
  }
}

function readVoice() {
  try {
    return localStorage.getItem(VOICE_KEY) || ''
  } catch (error) {
    return ''
  }
}

function remember(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    return
  }
}
