import { PromiseFn, Lifecycles } from './types'
import { request } from './util'
import { loadSandbox } from './sandbox'
import { App } from './types'

const MATCH_ANY_OR_NO_PROPERTY = /["'=\w\s/]*/
const SCRIPT_URL_RE = new RegExp(
  '<\\s*script' +
    MATCH_ANY_OR_NO_PROPERTY.source +
    '(?:src="(.+?)")' +
    MATCH_ANY_OR_NO_PROPERTY.source +
    '(?:\\/>|>[\\s]*<\\s*/script>)?',
  'g'
)
const SCRIPT_CONTENT_RE = new RegExp(
  '<\\s*script' +
    MATCH_ANY_OR_NO_PROPERTY.source +
    '>([\\w\\W]+?)<\\s*/script>',
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
<<<<<<< HEAD
const TEST_URL = /(?:https?):\/\/[-a-zA-Z0-9.]+/
=======
const TEST_URL = /^(?:https?):\/\/[-a-zA-Z0-9.]+/

>>>>>>> feat: add css parser
// const REPLACED_BY_BERIAL = 'Script replaced by Berial.'

// const SCRIPT_ANY_RE = /<script[^>]*>[\s\S]*?(<\s*\/script[^>]*>)/g

export async function importHtml(app: App) {
  const template = await request(app.entry as string)
  const proxy = (await loadSandbox(app.host)) as ProxyConstructor
  return await loadScript(template, proxy, app.name)
}

export async function loadScript(
  template: string,
  global: ProxyConstructor,
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

function parseScript(template: string) {
  const scriptURLs: string[] = []
  const scripts: string[] = []
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

function runScript(script: string, global: ProxyConstructor, umdName: string) {
  let bootstrap: PromiseFn,
    mount: PromiseFn,
    unmount: PromiseFn,
    update: PromiseFn

  eval(`(function(window) { 
    ${script};
    bootstrap = window[${umdName}].bootstrap;
    mount = window[${umdName}].mount;
    unmount = window[${umdName}].unmount;
    update = window[${umdName}].update;
  }).bind(global)(global)`)

  // @ts-ignore
  return { bootstrap, mount, unmount, update }
}

function parseCSS(template: string) {
  const cssURLs: string[] = []
  const styles: string[] = []
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
