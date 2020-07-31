import parseScript from './parseScript'
import runScript from './runScript'
import { fetchURL } from '../utils/fetch'
import { PromiseFn } from '../types'

interface ScriptExports {
  bootstrap: PromiseFn[]
  mount: PromiseFn[]
  unmount: PromiseFn[]
  update: PromiseFn[]
}

async function loadScript(
  template: string,
  global: WindowProxy = window
): Promise<ScriptExports> {
  const { scriptURLs, scripts } = parseScript(template)
  const fetchedScripts = await Promise.all(
    scriptURLs.map((url) => fetchURL(url))
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

export default loadScript
