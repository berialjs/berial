import { PromiseFn } from './types'
import { request } from './util'
import { Sandbox } from './sandbox'

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

interface ScriptExports {
  bootstrap: PromiseFn[]
  mount: PromiseFn[]
  unmount: PromiseFn[]
  update: PromiseFn[]
}

export async function importHtml(url: string) {
  const template = await request(url)
  const proxyWindow = new Sandbox()
  return await loadScript(template, proxyWindow.proxy)
}

export async function loadScript(
  template: string,
  global: ProxyConstructor
): Promise<ScriptExports> {
  const { scriptURLs, scripts } = parseScript(template)
  const fetchedScripts = await Promise.all(
    scriptURLs.map((url) => request(url))
  )
  const scriptsToLoad = fetchedScripts.concat(scripts)

  let bootstrap: PromiseFn[] = [],
    unmount: PromiseFn[] = [],
    mount: PromiseFn[] = [],
    update: PromiseFn[] = []

  scriptsToLoad.forEach((script) => {
    const lifecycles = runScript(script, global)
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
    scripts
  }
}

function runScript(script: string, global: ProxyConstructor) {
  let bootstrap: PromiseFn,
    mount: PromiseFn,
    unmount: PromiseFn,
    update: PromiseFn

  eval(`(function(window) { 
      ${script};
      bootstrap = window.bootstrap;
      mount = window.mount;
      unmount = window.unmount;
      update = window.update;
  })(${global})`)

  // @ts-ignore
  return { bootstrap, mount, unmount, update }
}
