import type { App, PromiseFn, Lifecycles, Lifecycle, ProxyType } from './types'

import { proxy } from './proxy'
import { request } from './util'

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
  const template = await request(app.entry as string)
  const styleNodes = await loadCSS(template)
  const bodyNode = loadBody(template)
  const fake = proxy(window as any, null)
  const lifecycle = await loadScript(template, fake, app.name)
  return { lifecycle, styleNodes, bodyNode }
}

export async function loadScript(
  template: string,
  global: ProxyType,
  name: string
): Promise<Lifecycles> {
  const { scriptURLs, scripts } = parseScript(template)
  const fetchedScripts = await Promise.all(
    scriptURLs.map((url) => request(url))
  )
  const scriptsToLoad = fetchedScripts.concat(scripts)

  let bootstrap: PromiseFn[] = []
  let unmount: PromiseFn[] = []
  let mount: PromiseFn[] = []
  let update: PromiseFn[] = []

  scriptsToLoad.forEach((script) => {
    const lifecycles = runScript(script, global, name)
    bootstrap = [...bootstrap, lifecycles.bootstrap]
    mount = [...mount, lifecycles.mount]
    unmount = [...unmount, lifecycles.unmount]
    update = [...update, lifecycles.update]
  })

  return { bootstrap, unmount, mount, update }
}

function parseScript(
  template: string
): {
  scriptURLs: string[]
  scripts: string[]
} {
  const scriptURLs: string[] = []
  const scripts: string[] = []
  SCRIPT_URL_RE.lastIndex = SCRIPT_CONTENT_RE.lastIndex = 0
  let match
  while ((match = SCRIPT_URL_RE.exec(template))) {
    let captured = match[1].trim()
    if (!captured) continue
    if (!TEST_URL.test(captured)) {
      captured = window.location.origin + captured
    }
    scriptURLs.push(captured)
  }
  while ((match = SCRIPT_CONTENT_RE.exec(template))) {
    const captured = match[1].trim()
    if (!captured) continue
    scripts.push(captured)
  }
  return {
    scriptURLs,
    scripts
  }
}

function runScript(
  script: string,
  global: ProxyType,
  umdName: string
): Lifecycle {
  const resolver = new Function(
    'window',
    `
    with(window.IS_BERIAL_SANDBOX) {
      try {
        ${script}
        return window['${umdName}']
      }
      catch(e) {
        console.log(e)
      }
    }
  `
  )
  return resolver.call(global, global)
}

async function loadCSS(template: string): Promise<HTMLStyleElement[]> {
  const { cssURLs, styles } = parseCSS(template)
  const fetchedStyles = await Promise.all(cssURLs.map((url) => request(url)))
  return toStyleNodes(fetchedStyles.concat(styles))

  function toStyleNodes(styles: string[]): HTMLStyleElement[] {
    return styles.map((style) => {
      const styleNode = document.createElement('style')
      styleNode.appendChild(document.createTextNode(style))
      return styleNode
    })
  }
}

function parseCSS(
  template: string
): {
  cssURLs: string[]
  styles: string[]
} {
  const cssURLs: string[] = []
  const styles: string[] = []
  CSS_URL_RE.lastIndex = STYLE_RE.lastIndex = 0
  let match
  while ((match = CSS_URL_RE.exec(template))) {
    let captured = match[1].trim()
    if (!captured) continue
    if (!TEST_URL.test(captured)) {
      captured = window.location.origin + captured
    }
    cssURLs.push(captured)
  }
  while ((match = STYLE_RE.exec(template))) {
    const captured = match[1].trim()
    if (!captured) continue
    styles.push(captured)
  }
  return {
    cssURLs,
    styles
  }
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
