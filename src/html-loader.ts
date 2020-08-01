import { PromiseFn, Lifecycles } from './types'
import { request } from './util'
import { loadSandbox } from './sandbox'
import { App } from './types'

const ANY_OR_NO_PROPERTY = /["'=\w\s]*/
const SCRIPT_URL_RE = new RegExp(
  '<script' +
    ANY_OR_NO_PROPERTY.source +
    '(?:src="(.+?)")' +
    ANY_OR_NO_PROPERTY.source +
    '(?:\\/>|>[\\s]*<\\/script>)?',
  'g'
)
const SCRIPT_CONTENT_RE = new RegExp(
  '<script' + ANY_OR_NO_PROPERTY.source + '>([\\w\\W]+?)</script>',
  'g'
)
// const REPLACED_BY_BERIAL = 'Script replaced by Berial.'

// const SCRIPT_ANY_RE = /<script[^>]*>[\s\S]*?(<\s*\/script[^>]*>)/g

export async function importHtml(app: App, host: Element) {
  const template = await request(app.entry as string)
  const proxy = (await loadSandbox(app.host)) as ProxyConstructor
  return await loadScript(template, proxy, app.name, host)
}

export async function loadScript(
  template: string,
  global: ProxyConstructor,
  name: string,
  host: Element
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
    const lifecycles = runScript(script, global, name, host)
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
    const captured = match[1].trim()
    if (!captured) continue
    scriptURLs.push(captured)
  }
  while ((match = SCRIPT_CONTENT_RE.exec(template))) {
    const captured = match[1].trim()
    if (!captured) continue
    scripts.push(captured)
  }
  return {
    scriptURLs,
    scripts,
  }
}

function runScript(
  script: string,
  global: ProxyConstructor,
  umdName: string,
  host: Element
) {
  let bootstrap: PromiseFn
  let mount: PromiseFn
  let unmount: PromiseFn
  let update: PromiseFn

  eval(`(function(window, document) { 
    ${script};
    bootstrap = window[${umdName}].bootstrap;
    mount = window[${umdName}].mount;
    unmount = window[${umdName}].unmount;
    update = window[${umdName}].update;
  }).bind(global)(global, host.shadowRoot)`)

  // @ts-ignore
  return { bootstrap, mount, unmount, update }
}
