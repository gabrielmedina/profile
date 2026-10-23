;(function () {
  var SESSION_MS = 30 * 60 * 1000
  var site = (window.__site = window.__site || { queue: [], key: '' })

  if (!site.track) {
    site.track = function (event, props) {
      site.queue.push([event, props || {}])
      if (site.flush) site.flush()
    }
  }

  site.flush = function () {
    var batch = site.queue.splice(0, site.queue.length)

    for (var index = 0; index < batch.length; index += 1) {
      send(batch[index][0], batch[index][1])
    }
  }

  document.addEventListener('click', onClick)
  trackPageViews()
  trackColorScheme()
  initReadingProgress()
  site.flush()

  function onClick(event) {
    var node = event.target
    if (!node || !node.closest) return

    var tracked = node.closest('[data-track]')
    if (tracked && !tracked.hasAttribute('data-copy')) {
      site.track(tracked.getAttribute('data-track'), readProps(tracked))
    }

    var copy = node.closest('[data-copy]')
    if (copy) copyUrl(copy)

    var speech = node.closest('[data-speech]')
    if (speech) loadSpeech(speech, event)
  }

  function trackPageViews() {
    var nodes = document.querySelectorAll('[data-page-view]')

    for (var index = 0; index < nodes.length; index += 1) {
      var node = nodes[index]
      var props = {}

      try {
        props = JSON.parse(node.textContent || '{}')
      } catch (error) {
        props = {}
      }

      site.track(node.getAttribute('data-page-view'), props)
    }
  }

  function trackColorScheme() {
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    site.track('prefers-color-theme', {
      theme: dark ? 'tokens-dark' : 'tokens-light',
    })
  }

  function initReadingProgress() {
    var bars = document.querySelectorAll('[data-reading-progress-bar]')
    if (!bars.length) return

    var native = supportsViewTimeline()

    for (var index = 0; index < bars.length; index += 1) {
      bindReadingProgress(bars[index], native)
    }
  }

  function supportsViewTimeline() {
    return !!(
      window.CSS &&
      CSS.supports &&
      CSS.supports('animation-timeline', 'view()')
    )
  }

  // Scroll-driven CSS paints the bar on the compositor. Geometry is read on
  // resize only. Browsers without that timeline get scaleX, never width.
  function bindReadingProgress(bar, native) {
    var frame = 0
    var metrics = null

    function measure() {
      metrics = readReadingMetrics(bar)
      if (metrics) bar.removeAttribute('data-reading-fits')
      else bar.setAttribute('data-reading-fits', 'true')
      paint()
    }

    function paint() {
      frame = 0
      syncReadingProgress(bar, readingProgress(metrics), native)
    }

    function requestPaint() {
      if (frame) return
      frame = window.requestAnimationFrame(paint)
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', measure)
    }
    // The article intro is a transform. Measuring through it caches the wrong
    // document offset, so the fallback bar lags the scroll after it ends.
    if (document.getAnimations) {
      document.getAnimations().forEach(function (animation) {
        if (!animation.finished) return
        animation.finished.then(measure).catch(function () {})
      })
    }

    var range = readingRangeElement(bar)
    if (typeof ResizeObserver !== 'undefined' && range) {
      new ResizeObserver(measure).observe(range)
    }

    window.addEventListener('scroll', requestPaint, { passive: true })
    if (!native && window.visualViewport) {
      window.visualViewport.addEventListener('scroll', requestPaint)
    }
  }

  function readingRangeElement(bar) {
    var article = bar.closest('article')
    return article && article.querySelector('[data-reading-progress-range]')
  }

  function readReadingMetrics(bar) {
    var range = readingRangeElement(bar)
    if (!range) return null

    var rect = range.getBoundingClientRect()
    var distance = rect.height - window.innerHeight
    if (distance <= 0) return null

    return {
      top: rect.top + window.scrollY,
      distance: distance,
    }
  }

  function readingProgress(metrics) {
    if (!metrics) return null
    return clamp((window.scrollY - metrics.top) / metrics.distance, 0, 1)
  }

  function syncReadingProgress(bar, progress, native) {
    var value = progress === null ? 0 : Math.round(progress * 100)
    var visible = progress !== null && progress > 0

    if (!native) {
      bar.style.transform = 'scaleX(' + (progress || 0) + ')'
      bar.style.opacity = visible ? '1' : '0'
    }

    if (visible) {
      if (bar.hasAttribute('aria-hidden')) bar.removeAttribute('aria-hidden')
    } else if (bar.getAttribute('aria-hidden') !== 'true') {
      bar.setAttribute('aria-hidden', 'true')
    }

    if (bar.getAttribute('aria-valuenow') !== String(value)) {
      bar.setAttribute('aria-valuenow', String(value))
    }
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
  }

  function send(event, props) {
    if (!site.key) {
      console.info('[analytics] ' + event, props || {})
      return
    }

    var identity = nextIdentity()
    if (!identity) return

    var body = JSON.stringify({
      api_key: site.key,
      events: [
        {
          device_id: identity.deviceId,
          session_id: identity.sessionId,
          event_id: identity.lastEventId,
          insert_id: uuid(),
          event_type: event,
          time: Date.now(),
          event_properties: props || {},
          platform: 'Web',
          language: navigator.language,
          os_name: osName(),
        },
      ],
    })

    fetch('https://api2.amplitude.com/2/httpapi', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: body,
      keepalive: true,
    }).catch(function () {})
  }

  function nextIdentity() {
    var stored = readIdentity()

    if (stored.optOut) return null

    if (!stored.deviceId) {
      var previous = readAmplitude(site.key)
      if (previous && previous.optOut) {
        stored.optOut = true
        writeIdentity(stored)
        return null
      }
      stored.deviceId =
        (previous && previous.deviceId) || uuid()
    }

    var now = Date.now()
    if (
      !stored.sessionId ||
      !stored.lastEventTime ||
      now - stored.lastEventTime > SESSION_MS
    ) {
      stored.sessionId = now
    }

    stored.lastEventId = (stored.lastEventId || 0) + 1
    stored.lastEventTime = now
    writeIdentity(stored)
    return stored
  }

  function readIdentity() {
    try {
      return JSON.parse(localStorage.getItem('site-analytics') || '{}') || {}
    } catch (error) {
      return {}
    }
  }

  function writeIdentity(value) {
    try {
      localStorage.setItem('site-analytics', JSON.stringify(value))
    } catch (error) {
      return
    }
  }

  function readAmplitude(apiKey) {
    var name = 'AMP_' + apiKey.slice(0, 10)
    var value = cookieValue(name)
    if (!value) return null

    try {
      var data = JSON.parse(decodeURIComponent(atob(value)))
      if (!data || typeof data !== 'object') return null
      return data
    } catch (error) {
      return null
    }
  }

  function cookieValue(name) {
    var cookies = document.cookie ? document.cookie.split('; ') : []

    for (var index = 0; index < cookies.length; index += 1) {
      var cookie = cookies[index]
      var eq = cookie.indexOf('=')
      if (cookie.slice(0, eq) === name) return cookie.slice(eq + 1)
    }

    return ''
  }

  function copyUrl(button) {
    var url = button.getAttribute('data-copy') || ''
    var label = button.querySelector('[data-copy-label]')
    var section = button.closest('section')
    var error = section && section.querySelector('[data-copy-error]')

    writeClipboard(url).then(
      function () {
        button.setAttribute('data-copied', 'true')
        if (label) label.textContent = 'Link copiado'
        if (error) error.hidden = true
        window.clearTimeout(button._copyTimer)
        button._copyTimer = window.setTimeout(function () {
          button.removeAttribute('data-copied')
          if (label) label.textContent = 'Copiar o link'
        }, 2400)
        site.track(button.getAttribute('data-track'), readProps(button))
      },
      function () {
        button.removeAttribute('data-copied')
        if (label) label.textContent = 'Copiar o link'
        if (error) {
          error.hidden = false
          error.textContent =
            'Não consegui copiar daqui. O endereço continua na barra do navegador.'
        }
      },
    )
  }

  function writeClipboard(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value).catch(function () {
        copyWithCommand(value)
      })
    }

    return new Promise(function (resolve, reject) {
      try {
        copyWithCommand(value)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  function copyWithCommand(value) {
    var field = document.createElement('textarea')
    field.value = value
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.left = '-9999px'
    document.body.append(field)
    field.select()
    var copied = document.execCommand('copy')
    field.remove()
    if (!copied) throw new Error('copy failed')
  }

  function readProps(node) {
    try {
      return JSON.parse(node.getAttribute('data-track-props') || '{}')
    } catch (error) {
      return {}
    }
  }

  var speechModule

  function loadSpeech(root, event) {
    var ready = speechModule
      ? Promise.resolve(speechModule)
      : import('/speech.js').then(function (mod) {
          speechModule = mod
          return mod
        })

    ready.then(function (mod) {
      mod.handle(root, event)
    }).catch(function () {})
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID()

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (char) {
        var random = (Math.random() * 16) | 0
        var value = char === 'x' ? random : (random & 0x3) | 0x8
        return value.toString(16)
      },
    )
  }

  function osName() {
    var ua = navigator.userAgent
    if (/Windows/.test(ua)) return 'Windows'
    if (/Android/.test(ua)) return 'Android'
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
    if (/Mac OS X/.test(ua)) return 'Mac OS X'
    if (/CrOS/.test(ua)) return 'Chrome OS'
    if (/Linux/.test(ua)) return 'Linux'
    return 'Unknown'
  }
})()
