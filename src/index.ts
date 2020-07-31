import { App } from './types'

const NOT_LOADED = 'NOT_LOADED'
const LOADING = 'LOADING'
const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'
const BOOTSTRAPPING = 'BOOTSTRAPPING'
const NOT_MOUNTED = 'NOT_MOUNTED'
const MOUNTING = 'MOUNTING'
const MOUNTED = 'MOUNTED'
const UNMOUNTING = 'UNMOUNTING'

let started = false
const apps: App[] = []

export function register(
  name: string,
  load: string,
  match: any,
  props: Record<string, unknown>
) {
  if (typeof match === 'string') {
    match = (location: Window['location']) =>
      location.pathname.startsWith(match)
  }

  if (props) {
    props = new Proxy(props, {
      get(target, key: string) {
        return target[key]
      },
      set(target, key: string, val) {
        target[key] = val
        reroute()
        return true
      }
    })
  }

  apps.push({
    name,
    load,
    match,
    props,
    status: NOT_LOADED
  } as App)
}

export function start() {
  started = true
  reroute()
}

function reroute() {
  const { loads, mounts, unmounts } = getAppChanges()
  if (started) {
    return perform()
  } else {
    return init()
  }
  async function init() {
    await Promise.all(loads.map(toLoadPromise))
  }
  async function perform() {
    unmounts.map(runUnmount)
    loads.map(async (app) => {
      app = await runLoad(app)
      app = await runBootstrap(app)
      return runMount(app)
    })
    mounts.map(async (app) => {
      app = await runBootstrap(app)
      return runMount(app)
    })
  }
}

function getAppChanges() {
  const unmounts: App[] = []
  const loads: App[] = []
  const mounts: App[] = []
  apps.forEach((app) => {
    const isActive = app.match(window.location)
    switch (app.status) {
      case NOT_LOADED:
      case LOADING:
        isActive && loads.push(app)
        break
      case NOT_BOOTSTRAPPED:
      case BOOTSTRAPPING:
      case NOT_MOUNTED:
        isActive && mounts.push(app)
        break
      case MOUNTED:
        !isActive && unmounts.push(app)
    }
  })
  return { unmounts, loads, mounts }
}

function compose(fns: any[]) {
  fns = Array.isArray(fns) ? fns : [fns]
  return (props: any) =>
    fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve())
}

async function runLoad(app: App) {
  if (app.loaded) {
    return app.loaded
  }
  app.loaded = Promise.resolve().then(async () => {
    app.status = LOADING
    let lifecycle = null
    if (typeof app.load === 'string'){
      // import html
    } else {
      lifecycle = await app.load(app.props)
    }
    let host = await createShadow(app)
    app.status = NOT_BOOTSTRAPPED
    app.bootstrap = compose(lifecycle.bootstrap)
    app.mount = compose(lifecycle.mount)
    app.unmount = compose(lifecycle.unmount)
    app.host = host as HTMLElement
    delete app.loaded
    return app
  })
  return app.loaded
}

async function createShadow(app: App) {
  return new Promise((resolve, reject) => {
    try {
      class Berial extends HTMLElement {
        static get componentName() {
          return app.name
        }
        connectedCallback() {
          this.attachShadow({ mode: 'open' })
          resolve(this)
        }
        constructor() {
          super()
        }
      }
      const hasDef = window.customElements.get(app.name)
      if (!hasDef) {
        customElements.define(app.name, Berial)
      }
    } catch (e) {
      reject(e)
    }
  })
}

async function runUnmount(app: App) {
  if (app.status != MOUNTED) {
    return app
  }
  app.status = UNMOUNTING
  await app.unmount(app.props)
  app.status = NOT_MOUNTED
  return app
}

async function runBootstrap(app: App) {
  if (app.status !== NOT_BOOTSTRAPPED) {
    return app
  }
  app.status = BOOTSTRAPPING
  await app.bootstrap(app.props)
  app.status = NOT_MOUNTED
  return app
}

async function runMount(app: App) {
  if (app.status !== NOT_MOUNTED) {
    return app
  }
  app.status = MOUNTING
  await app.mount(app.props)
  app.status = MOUNTED
  return app
}

const routingEventsListeningTo = ['hashchange', 'popstate']

function urlReroute() {
  reroute()
}
const capturedEventListeners = {
  hashchange: [],
  popstate: []
} as any

window.addEventListener('hashchange', urlReroute)
window.addEventListener('popstate', urlReroute)
const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener
window.addEventListener = function(name: any, fn: any, ...args: any) {
  if (
    routingEventsListeningTo.indexOf(name) >= 0 &&
    !capturedEventListeners[name].some((l: any) => l == fn)
  ) {
    capturedEventListeners[name].push(fn)
    return
  }
  return originalAddEventListener.apply(this, args)
}
window.removeEventListener = function(name: any, fn: any, ...args: any) {
  if (routingEventsListeningTo.indexOf(name) >= 0) {
    capturedEventListeners[name] = capturedEventListeners[name].filter(
      (l: any) => l !== fn
    )
    return
  }
  return originalRemoveEventListener.apply(this, args)
}

function patchedUpdateState(updateState: any, ...args: any) {
  return function() {
    const urlBefore = window.location.href
    //@ts-ignore
    updateState.apply(this, args)
    const urlAfter = window.location.href

    if (urlBefore !== urlAfter) {
      // @ts-ignore
      urlReroute(new PopStateEvent('popstate'))
    }
  }
}

window.history.pushState = patchedUpdateState(window.history.pushState)
window.history.replaceState = patchedUpdateState(window.history.replaceState)
