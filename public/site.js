;(function () {
  var SESSION_MS = 30 * 60 * 1000
  var FLUSH_MS = 1000
  // Mobile chrome and subpixels leave the ratio a hair under 1 at the real end.
  var READING_END_PX = 8
  var CAMPAIGN_KEY = 'site-analytics-campaign'
  var EMPTY_CAMPAIGN = 'EMPTY'
  // Same names the Browser SDK wrote, so existing charts keep filling.
  var CAMPAIGN_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'utm_id',
    'referrer',
    'referring_domain',
    'dclid',
    'fbclid',
    'gbraid',
    'gclid',
    'ko_click_id',
    'li_fat_id',
    'msclkid',
    'rdt_cid',
    'ttclid',
    'twclid',
    'wbraid',
  ]
  var site = (window.__site = window.__site || { queue: [], key: '' })
  var flushTimer = 0

  if (!site.track) {
    site.track = function (event, props) {
      site.queue.push([event, props || {}, Date.now()])
      if (site.flush) site.flush()
    }
  }

  // One request per quiet second. pagehide flushes the queue so a click that
  // navigates still leaves with its events. Dev, without a key, logs at once.
  site.flush = function () {
    if (!site.key) {
      flushNow()
      return
    }
    if (flushTimer) return
    flushTimer = window.setTimeout(flushNow, FLUSH_MS)
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flushNow()
  })
  window.addEventListener('pagehide', flushNow)

  document.addEventListener('click', onClick)
  trackPageViews()
  trackColorScheme()
  initReadingProgress()
  initTagFilters()
  initArticleOutline()
  site.flush()

  function onClick(event) {
    var node = event.target
    if (!node || !node.closest) return

    var tracked = node.closest('[data-track]')
    if (
      tracked &&
      !tracked.hasAttribute('data-copy') &&
      !tracked.hasAttribute('data-copy-code')
    ) {
      site.track(tracked.getAttribute('data-track'), readProps(tracked))
    }

    var copyCode = node.closest('[data-copy-code]')
    if (copyCode) copyCodeBlock(copyCode)

    var copy = node.closest('[data-copy]')
    if (copy) copyUrl(copy)

    var speech = node.closest('[data-speech]')
    if (speech) loadSpeech(speech, event)

    var outlineToggle = node.closest('[data-outline-toggle]')
    if (outlineToggle) toggleOutlineGroup(outlineToggle)
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

  // OS theme is a device trait. Sending it on every page doubles volume and
  // does not change a funnel. Report again only when the value changes.
  function trackColorScheme() {
    var theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'tokens-dark'
      : 'tokens-light'
    var stored = readIdentity()

    if (stored.optOut || stored.colorTheme === theme) return

    stored.colorTheme = theme
    writeIdentity(stored)
    site.track('prefers-color-theme', { theme: theme })
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
      if (!metrics && laidOutRange(bar)) finishReading(bar, 'visible')
    }

    function paint() {
      frame = 0
      syncReadingProgress(bar, readingProgress(metrics), native)
      if (reachedReadingEnd(metrics)) finishReading(bar, 'scrolled')
    }

    function requestPaint() {
      if (frame) return
      frame = window.requestAnimationFrame(paint)
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(function () {})
    }
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

  // A range with no height is not laid out yet. That is not a short post.
  function laidOutRange(bar) {
    var range = readingRangeElement(bar)
    if (!range) return false
    return range.getBoundingClientRect().height > 0
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

  function reachedReadingEnd(metrics) {
    if (!metrics) return false
    return metrics.distance - (window.scrollY - metrics.top) <= READING_END_PX
  }

  // Fires once per view, after load and fonts, so a short post that fits and a
  // long post scrolled to the end share one funnel step. `post` and `slug`
  // match opened-post-page, which is what the funnel holds constant.
  function finishReading(bar, completion) {
    if (document.readyState !== 'complete') return
    if (document.fonts && document.fonts.status === 'loading') return
    if (bar.hasAttribute('data-reading-finished')) return

    var slug = bar.getAttribute('data-reading-slug')
    if (!slug) return

    bar.setAttribute('data-reading-finished', 'true')
    site.track('finished-reading-post', {
      post: bar.getAttribute('data-reading-title') || '',
      slug: slug,
      completion: completion,
    })
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

  function initTagFilters() {
    var lists = document.querySelectorAll('[data-tag-list]')
    if (!lists.length) return

    for (var index = 0; index < lists.length; index += 1) {
      watchTagList(lists[index])
    }

    function reveal() {
      for (var index = 0; index < lists.length; index += 1) {
        scrollTagListToCurrent(lists[index])
      }
    }

    // fonts.ready resolves before the next layout. Measuring in that
    // microtask uses fallback widths, then the real font misses the chip.
    function scheduleReveal() {
      window.requestAnimationFrame(reveal)
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleReveal).catch(scheduleReveal)
      return
    }

    scheduleReveal()
  }

  function watchTagList(list) {
    function mark() {
      list.setAttribute('data-tag-user-scroll', 'true')
    }

    list.addEventListener('pointerdown', mark, { once: true })
    list.addEventListener('wheel', mark, { passive: true, once: true })
    list.addEventListener('touchstart', mark, { passive: true, once: true })
  }

  // Move only the subject row. Park the current chip on the right edge when
  // the real list is long enough; otherwise it stays where it already fits.
  // A drag or wheel before the font swap wins.
  function scrollTagListToCurrent(list) {
    if (list.hasAttribute('data-tag-user-scroll')) return

    var current = list.querySelector('[aria-current="page"]')
    if (!current) return

    var item = current.closest('li') || current
    var listRect = list.getBoundingClientRect()
    var itemRect = item.getBoundingClientRect()
    var fits = itemRect.width <= listRect.width
    var edge = fits
      ? itemRect.right - listRect.right
      : itemRect.left - listRect.left
    var max = Math.max(0, list.scrollWidth - list.clientWidth)
    var next = clamp(list.scrollLeft + edge, 0, max)

    if (Math.abs(next - list.scrollLeft) < 1) return

    list.scrollTo({ left: next })
  }

  function initArticleOutline() {
    var navs = document.querySelectorAll('[data-article-outline]')
    if (!navs.length) return

    for (var index = 0; index < navs.length; index += 1) {
      bindArticleOutline(navs[index])
    }
  }

  function bindArticleOutline(nav) {
    var links = nav.querySelectorAll('[data-outline-link]')
    var items = []

    for (var index = 0; index < links.length; index += 1) {
      var link = links[index]
      var heading = outlineHeading(link)
      if (!heading) continue
      items.push({ link: link, heading: heading, top: 0 })
    }

    if (!items.length) return

    var frame = 0
    var currentId = null
    var content = articleContent(nav)

    function measure() {
      for (var index = 0; index < items.length; index += 1) {
        var rect = items[index].heading.getBoundingClientRect()
        items[index].top = rect.top + window.scrollY
      }
      sync()
    }

    function sync() {
      frame = 0
      var line = window.scrollY + Math.min(128, window.innerHeight * 0.28)
      var next = null

      for (var index = 0; index < items.length; index += 1) {
        if (items[index].top <= line) next = items[index]
      }

      var maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll > 0 && window.scrollY >= maxScroll - 4) {
        next = items[items.length - 1]
      }

      var nextId = next ? next.heading.id : ''
      if (nextId === currentId) return
      currentId = nextId
      applyOutlineCurrent(nav, next)
    }

    function requestSync() {
      if (frame) return
      frame = window.requestAnimationFrame(sync)
    }

    measure()
    window.addEventListener('scroll', requestSync, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    window.addEventListener('hashchange', measure)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', measure)
    }
    if (typeof ResizeObserver !== 'undefined' && content) {
      new ResizeObserver(measure).observe(content)
    }
    // The article intro is a transform. Measuring through it caches the
    // wrong document offset, same as the reading bar.
    if (document.getAnimations) {
      document.getAnimations().forEach(function (animation) {
        if (!animation.finished) return
        animation.finished.then(measure).catch(function () {})
      })
    }
  }

  function articleContent(nav) {
    var frame = nav.closest('[data-article-frame]')
    if (!frame) return null
    // The cover sits above the frame. Its height moves every heading.
    return frame.parentElement || frame
  }

  function outlineHeading(link) {
    var href = link.getAttribute('href') || ''
    if (href.charAt(0) !== '#') return null

    var id = href.slice(1)
    try {
      id = decodeURIComponent(id)
    } catch (error) {
      id = href.slice(1)
    }

    return document.getElementById(id)
  }

  function applyOutlineCurrent(nav, item) {
    var currents = nav.querySelectorAll('[aria-current="location"]')
    for (var index = 0; index < currents.length; index += 1) {
      currents[index].removeAttribute('aria-current')
    }

    var actives = nav.querySelectorAll('[data-outline-active]')
    for (var active = 0; active < actives.length; active += 1) {
      actives[active].removeAttribute('data-outline-active')
    }

    if (!item) return

    item.link.setAttribute('aria-current', 'location')
    var nested = item.link.closest('[data-outline-nested]')
    if (nested) openOutlineGroup(nested)

    var row = item.link.closest('[data-outline-item]')
    if (row) row.setAttribute('data-outline-active', 'true')
    revealOutlineLink(nav, item.link)
  }

  function openOutlineGroup(nested) {
    var branch = nested.parentElement
    if (!branch || !branch.hasAttribute('data-outline-item')) return
    setOutlineGroup(branch, true)
  }

  function toggleOutlineGroup(button) {
    var branch = button.closest('[data-outline-item]')
    if (!branch) return
    setOutlineGroup(branch, !branch.hasAttribute('data-outline-open'))
  }

  function setOutlineGroup(branch, open) {
    var button = branch.querySelector('[data-outline-toggle]')
    if (!button) return

    if (open) branch.setAttribute('data-outline-open', 'true')
    else branch.removeAttribute('data-outline-open')

    button.setAttribute('aria-expanded', open ? 'true' : 'false')
    var name = button.getAttribute('data-outline-name') || ''
    button.setAttribute(
      'aria-label',
      (open ? 'Ocultar subseções de ' : 'Mostrar subseções de ') + name,
    )
  }

  function revealOutlineLink(nav, link) {
    var list = nav.querySelector('[data-outline-list]')
    if (!list || list.scrollHeight <= list.clientHeight + 1) return

    var listRect = list.getBoundingClientRect()
    var linkRect = link.getBoundingClientRect()
    if (linkRect.top >= listRect.top && linkRect.bottom <= listRect.bottom) {
      return
    }

    var delta =
      linkRect.top - listRect.top - (listRect.height - linkRect.height) / 2
    list.scrollTop += delta
  }

  function flushNow() {
    if (flushTimer) {
      window.clearTimeout(flushTimer)
      flushTimer = 0
    }

    var batch = site.queue.splice(0, site.queue.length)
    if (!batch.length) return

    var campaign = readCampaign()

    if (!site.key) {
      for (var index = 0; index < batch.length; index += 1) {
        console.info(
          '[analytics] ' + batch[index][0],
          merge(campaign, batch[index][1] || {}),
        )
      }
      return
    }

    var previous = readStoredCampaign()
    var freshSession = sessionStale(readIdentity(), Date.now())
    var identify = isNewCampaign(campaign, previous, freshSession)
      ? identifyOps(campaign)
      : null
    var identity = reserveIdentity(batch.length + (identify ? 1 : 0))
    if (!identity) return
    if (identify) writeStoredCampaign(campaign)

    var events = []
    var offset = 0

    // Same timestamp as the first event, and a lower event_id, so the user
    // properties are already set when that event is counted.
    if (identify) {
      events.push(
        payload(
          identity,
          identity.eventId,
          '$identify',
          batch[0][2] || Date.now(),
          null,
          identify,
        ),
      )
      offset = 1
    }

    for (var eventIndex = 0; eventIndex < batch.length; eventIndex += 1) {
      events.push(
        payload(
          identity,
          identity.eventId + offset + eventIndex,
          batch[eventIndex][0],
          batch[eventIndex][2] || Date.now(),
          merge(campaign, batch[eventIndex][1] || {}),
          null,
        ),
      )
    }

    fetch('https://api2.amplitude.com/2/httpapi', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ api_key: site.key, events: events }),
      keepalive: true,
    }).catch(function () {})
  }

  function reserveIdentity(count) {
    var stored = readIdentity()

    if (stored.optOut) return null

    if (!stored.deviceId) {
      var previous = readAmplitude(site.key)
      if (previous && previous.optOut) {
        stored.optOut = true
        writeIdentity(stored)
        return null
      }
      stored.deviceId = (previous && previous.deviceId) || uuid()
    }

    var now = Date.now()
    if (sessionStale(stored, now)) stored.sessionId = now

    var eventId = (stored.lastEventId || 0) + 1
    stored.lastEventId = eventId + count - 1
    stored.lastEventTime = now
    writeIdentity(stored)
    return {
      deviceId: stored.deviceId,
      sessionId: stored.sessionId,
      eventId: eventId,
    }
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
    return readAmplitudeCookie('AMP_' + apiKey.slice(0, 10))
  }

  function readAmplitudeCookie(name) {
    var value = cookieValue(name)
    if (!value) return null

    try {
      var data = JSON.parse(decodeURIComponent(atob(value)))
      if (!data || typeof data !== 'object' || Array.isArray(data)) return null
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

  function copyCodeBlock(button) {
    var block = button.closest('[data-code-block]')
    var code = block && block.querySelector('pre code')
    var text = code ? code.textContent || '' : ''
    var label = button.querySelector('[data-copy-label]')
    var error = block && block.querySelector('[data-copy-error]')

    writeClipboard(text).then(
      function () {
        button.setAttribute('data-copied', 'true')
        if (label) label.textContent = 'Copiado'
        if (error) error.hidden = true
        window.clearTimeout(button._copyTimer)
        button._copyTimer = window.setTimeout(function () {
          button.removeAttribute('data-copied')
          if (label) label.textContent = 'Copiar'
        }, 2400)
      },
      function () {
        button.removeAttribute('data-copied')
        if (label) label.textContent = 'Copiar'
        if (error) {
          error.hidden = false
          error.textContent =
            'Não consegui copiar o código. Selecione o trecho e copie manualmente.'
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

  function sessionStale(stored, now) {
    return (
      !stored.sessionId ||
      !stored.lastEventTime ||
      now - stored.lastEventTime > SESSION_MS
    )
  }

  // Country is the request IP. Device family is parsed from user_agent.
  // platform stays Web: mobile and desktop are not a separate platform.
  // os_name stays unset so the parsed browser remains the OS. Setting it
  // without the other device fields clears device family.
  function payload(identity, eventId, type, time, properties, userProperties) {
    var event = {
      device_id: identity.deviceId,
      session_id: identity.sessionId,
      event_id: eventId,
      insert_id: uuid(),
      event_type: type,
      time: time,
      platform: 'Web',
      language: navigator.language,
      ip: '$remote',
      user_agent: navigator.userAgent,
    }

    if (userProperties) event.user_properties = userProperties
    else event.event_properties = properties || {}

    return event
  }

  function readCampaign() {
    var params = new URLSearchParams(window.location.search)
    var campaign = {}

    for (var index = 0; index < CAMPAIGN_KEYS.length; index += 1) {
      var key = CAMPAIGN_KEYS[index]
      if (key === 'referrer' || key === 'referring_domain') continue
      var value = params.get(key)
      if (value) campaign[key] = value
    }

    var referrer = document.referrer || ''
    if (!referrer) return campaign

    campaign.referrer = referrer
    var host = referrer.split('/')[2]
    if (host) campaign.referring_domain = host
    return campaign
  }

  // The first visit is a new origem, and so is a change in UTM, click id, or
  // referrer domain. The site's own domain is navigation, not a new source.
  // Direct traffic mid-session does not wipe the source already stored.
  function isNewCampaign(current, previous, newSession) {
    if (isOwnReferrer(current.referring_domain)) return false
    if (!newSession && isDirectCampaign(current) && previous) return false
    if (!previous) return true

    for (var index = 0; index < CAMPAIGN_KEYS.length; index += 1) {
      var key = CAMPAIGN_KEYS[index]
      if (key === 'referrer' || key === 'referring_domain') continue
      if (campaignValue(current, key) !== campaignValue(previous, key)) {
        return true
      }
    }

    return (
      baseDomain(current.referring_domain) !==
      baseDomain(previous.referring_domain)
    )
  }

  function isDirectCampaign(campaign) {
    for (var index = 0; index < CAMPAIGN_KEYS.length; index += 1) {
      if (campaignValue(campaign, CAMPAIGN_KEYS[index])) return false
    }
    return true
  }

  function isOwnReferrer(domain) {
    if (!domain) return false
    var base = baseDomain(window.location.hostname)
    if (!base) return false
    return domain === base || domain.slice(-(base.length + 1)) === '.' + base
  }

  function baseDomain(domain) {
    if (!domain) return ''
    var parts = String(domain).split('.')
    if (parts.length <= 2) return domain
    return parts.slice(parts.length - 2).join('.')
  }

  function campaignValue(campaign, key) {
    var value = campaign && campaign[key]
    if (value === undefined || value === null || value === '') return ''
    return String(value)
  }

  function identifyOps(campaign) {
    var setOnce = {}
    var set = {}
    var unset = {}
    var hasSet = false

    for (var index = 0; index < CAMPAIGN_KEYS.length; index += 1) {
      var key = CAMPAIGN_KEYS[index]
      var value = campaignValue(campaign, key)
      setOnce['initial_' + key] = value || EMPTY_CAMPAIGN
      if (value) {
        set[key] = value
        hasSet = true
      } else {
        unset[key] = '-'
      }
    }

    var ops = { $setOnce: setOnce, $unset: unset }
    if (hasSet) ops.$set = set
    return ops
  }

  function readStoredCampaign() {
    var stored = readJson(CAMPAIGN_KEY)
    if (stored) return stored
    if (!site.key) return null

    var legacy = readAmplitudeCookie('AMP_MKTG_' + site.key.slice(0, 10))
    if (!legacy) return null

    writeStoredCampaign(legacy)
    return legacy
  }

  function writeStoredCampaign(campaign) {
    try {
      localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaign || {}))
    } catch (error) {
      return
    }
  }

  function readJson(key) {
    try {
      var data = JSON.parse(localStorage.getItem(key) || 'null')
      if (!data || typeof data !== 'object' || Array.isArray(data)) return null
      return data
    } catch (error) {
      return null
    }
  }

  function merge(base, extra) {
    var out = {}
    copyKeys(out, base)
    copyKeys(out, extra)
    return out
  }

  function copyKeys(target, source) {
    if (!source) return

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
})()
