import type { App, PromiseFn, Lifecycles } from './types'

import { run } from './sandbox'
import { request, nextTick } from './util'

const MATCH_ANY_OR_NO_PROPERTY = /["'=\w\s\/]*/
const SCRIPT_URL_RE = new RegExp(
  '<\\s*script' +
    MATCH_ANY_OR_NO_PROPERTY.source +
    '(?:src="(.+?)")' +
    MATCH_ANY_OR_NO_PROPERTY.source +
    '(?:\\/>|>[\\s]*<\\s*\\/script>)?',
  'g'
)
const SCRIPT_CONTENT_RE = new RegExp(
  '<\\s*script' +
    MATCH_ANY_OR_NO_PROPERTY.source +
    '>([\\w\\W]+?)<\\s*\\/script>',
  'g'
)
const SCRIPT_URL_OR_CONTENT_RE = new RegExp(
  '(?:' + SCRIPT_URL_RE.source + ')|(?:' + SCRIPT_CONTENT_RE.source + ')',
  'g'
)
const MATCH_NONE_QUOTE_MARK = /[^"]/
const CSS_URL_RE = new RegExp(
  '<\\s*link[^>]*' +
    'href="(' +
    MATCH_NONE_QUOTE_MARK.source +
    '+.css' +
    MATCH_NONE_QUOTE_MARK.source +
    '*)"' +
    MATCH_ANY_OR_NO_PROPERTY.source +
    '>(?:\\s*<\\s*\\/link>)?',
  'g'
)
const STYLE_RE = /<\s*style\s*>([^<]*)<\s*\/style>/g
const CSS_URL_OR_STYLE_RE = new RegExp(
  '(?:' + CSS_URL_RE.source + ')|(?:' + STYLE_RE.source + ')',
  'g'
)
const BODY_CONTENT_RE = /<\s*body[^>]*>([\w\W]*)<\s*\/body>/
const SCRIPT_ANY_RE = /<\s*script[^>]*>[\s\S]*?(<\s*\/script[^>]*>)/g
const TEST_URL = /^(?:https?):\/\/[-a-zA-Z0-9.]+/

const REPLACED_BY_BERIAL = 'Script replaced by Berial.'

export async function importHtml(
  app: App
): Promise<{
  lifecycle: Lifecycles
  styleNodes: HTMLStyleElement[]
  bodyNode: HTMLTemplateElement
}> {
  const template = await request(app.url as string)
  const styleNodes = await loadCSS(template)
  const bodyNode = loadBody(template)
  const lifecycle = await loadScript(template, app)
  return { lifecycle, styleNodes, bodyNode }
}

export async function loadScript(
  template: string,
  { name, host }: any
): Promise<Lifecycles> {
  let bootstrap: PromiseFn[] = []
  let unmount: PromiseFn[] = []
  let mount: PromiseFn[] = []
  let scriptsNextTick: string[] = []

  new MutationObserver((mutations) => {
    mutations.forEach(async (m: any) => {
      switch (m.type) {
        case 'childList':
          if (m.target !== host) {
            for (let i = 0; i < m.addedNodes.length; i++) {
              const node = m.addedNodes[i]
              if (node instanceof HTMLScriptElement) {
                const src = node.getAttribute('src') || ''
                const script = await request(src)
                scriptsNextTick.push(script)
              }
            }
          }
          break
        default:
      }
    })
  }).observe(document, { childList: true, subtree: true })

  const scriptsToLoad = await Promise.all(
    parseScript(template).map((v: string) => {
      if (TEST_URL.test(v)) return request(v)
      return v
    })
  )

  function getLyfecycles(script: string): void {
    let lifecycles = run(script, {})[name]
    if (lifecycles) {
      bootstrap =
        typeof lifecycles.bootstrap === 'function'
          ? [...bootstrap, lifecycles.bootstrap]
          : bootstrap
      mount =
        typeof lifecycles.mount === 'function'
          ? [...mount, lifecycles.mount]
          : mount
      unmount =
        typeof lifecycles.unmount === 'function'
          ? [...unmount, lifecycles.unmount]
          : unmount
    }
  }

  scriptsToLoad.forEach(getLyfecycles)
  nextTick(() => scriptsNextTick.forEach(getLyfecycles))

  return { bootstrap, unmount, mount }
}

function parseScript(template: string): string[] {
  const scriptList = []
  SCRIPT_URL_OR_CONTENT_RE.lastIndex = 0
  let match
  while ((match = SCRIPT_URL_OR_CONTENT_RE.exec(template))) {
    let captured
    if (match[1]) {
      captured = match[1].trim()
      if (!TEST_URL.test(captured)) {
        captured = window.location.origin + captured
      }
    } else if (match[2]) {
      captured = match[2].trim()
    }
    captured && scriptList.push(captured)
  }
  return scriptList
}

async function loadCSS(template: string): Promise<HTMLStyleElement[]> {
  const styles = await Promise.all(
    parseCSS(template).map((v: string) => {
      if (TEST_URL.test(v)) return request(v)
      return v
    })
  )
  return toStyleNodes(styles)

  function toStyleNodes(s: string[]): HTMLStyleElement[] {
    return s.map((style) => {
      const styleNode = document.createElement('style')
      styleNode.appendChild(document.createTextNode(style))
      return styleNode
    })
  }
}

function parseCSS(template: string): string[] {
  const cssList: string[] = []
  CSS_URL_OR_STYLE_RE.lastIndex = 0
  let match
  while ((match = CSS_URL_OR_STYLE_RE.exec(template))) {
    let captured
    if (match[1]) {
      captured = match[1].trim()
      if (!TEST_URL.test(captured)) {
        captured = window.location.origin + captured
      }
    } else if (match[2]) {
      captured = match[2].trim()
    }
    captured && cssList.push(captured)
  }
  return cssList
}

function loadBody(template: string): HTMLTemplateElement {
  let bodyContent = template.match(BODY_CONTENT_RE)?.[1] ?? ''
  bodyContent = bodyContent.replace(SCRIPT_ANY_RE, scriptReplacer)

  const body = document.createElement('template')
  body.innerHTML = bodyContent
  return body

  function scriptReplacer(substring: string): string {
    const matchedURL = SCRIPT_URL_RE.exec(substring)
    if (matchedURL) {
      return `<!-- ${REPLACED_BY_BERIAL} Original script url: ${matchedURL[1]} -->`
    }
    return `<!-- ${REPLACED_BY_BERIAL} Original script: inline script -->`
  }
}
