import parseScript from './parseScript'
import runScript from './runScript'

async function loadScript(htmlEntry: string, global: WindowProxy = window) {
  const { scriptUrls, scripts } = parseScript(htmlEntry)
  const fetchPromises = scriptUrls.map((url) =>
    fetch(url, {
      mode: 'cors'
    })
  )
  const scriptsFromUrls = await Promise.all(fetchPromises).then((responses) => {
    let script: string[] = []
    responses.map((res) =>
      res.text().then((res) => (script = [...script, res]))
    )
    return script
  })

  const scriptsToLoad = scriptsFromUrls.concat(scripts)

  let bootstrap: Promise<void>[] = [],
    unmount: Promise<void>[] = [],
    mount: Promise<void>[] = []

  scriptsToLoad.forEach((script) => {
    const lifecycles = runScript(script, global)

    bootstrap = [...bootstrap, lifecycles.bootstrap]
    mount = [...mount, lifecycles.mount]
    unmount = [...unmount, lifecycles.unmount]
  })

  return { bootstrap, unmount, mount }
}

export default loadScript
