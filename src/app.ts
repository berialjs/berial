import type { App, Lifecycles } from './types'
import { importHtml } from './html-loader'
import { lifecycleCheck } from './util'
export enum Status {
  NOT_LOADED = 'NOT_LOADED',
  LOADING = 'LOADING',
  NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED',
  BOOTSTRAPPING = 'BOOTSTRAPPING',
  NOT_MOUNTED = 'NOT_MOUNTED',
  MOUNTING = 'MOUNTING',
  MOUNTED = 'MOUNTED',
  UPDATING = 'UPDATING',
  UPDATED = 'UPDATED',
  UNMOUNTING = 'UNMOUNTING'
}

let started = false
const apps: any = new Set()
const mixins: any = new Set()
const plugins: any = new Set()

export function register(name: string, entry: string, match: any): void {
  apps.add({
    name,
    entry,
    match,
    status: Status.NOT_LOADED
  } as App)
}

export function start(): void {
  started = true
  reroute()
}

export function use(plugin: () => any): void {
  if (!plugins.has(plugin)) {
    plugins.add(plugin)
    plugin()
  }
}

export function mixin(mix: any): void {
  if (mixins.has(mix)) {
    mixins.add(mix)
  }
}

function reroute(): Promise<void> {
  const { loads, mounts, unmounts } = getAppChanges()

  if (started) {
    return perform()
  } else {
    return init()
  }

  async function init(): Promise<void> {
    await Promise.all(loads.map(runLoad))
  }

  async function perform(): Promise<void> {
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

function getAppChanges(): {
  unmounts: App[]
  loads: App[]
  mounts: App[]
} {
  const unmounts: App[] = []
  const loads: App[] = []
  const mounts: App[] = []

  apps.forEach((app: any) => {
    const isActive: boolean = app.match(window.location)
    switch (app.status) {
      case Status.NOT_LOADED:
      case Status.LOADING:
        isActive && loads.push(app)
        break
      case Status.NOT_BOOTSTRAPPED:
      case Status.BOOTSTRAPPING:
      case Status.NOT_MOUNTED:
        isActive && mounts.push(app)
        break
      case Status.MOUNTED:
        !isActive && unmounts.push(app)
    }
  })
  return { unmounts, loads, mounts }
}

function compose(
  fns: ((app: App) => Promise<any>)[]
): (app: App) => Promise<void> {
  fns = Array.isArray(fns) ? fns : [fns]
  return (app: App): Promise<void> =>
    fns.reduce((p, fn) => p.then(() => fn(app)), Promise.resolve())
}

async function runLoad(app: App): Promise<any> {
  if (app.loaded) {
    return app.loaded
  }

  app.loaded = Promise.resolve().then(async () => {
    app.status = Status.LOADING
    let lifecycle: Lifecycles
    let bodyNode: HTMLTemplateElement
    let styleNodes: HTMLStyleElement[]
    let map = mapMixin()
    let host = (await loadShadowDOM(app)) as any // null shadow dom
    app.host = host
    if (typeof app.entry === 'string') {
      const exports = await importHtml(app)
      lifecycleCheck(exports.lifecycle)
      lifecycle = exports.lifecycle
      bodyNode = exports.bodyNode
      styleNodes = exports.styleNodes

      host.shadowRoot?.appendChild(bodyNode.content.cloneNode(true))
      for (const k of styleNodes) {
        host.shadowRoot!.insertBefore(k, host.shadowRoot!.firstChild)
      }
    } else {
      lifecycle = (await app.entry(app)) as any
      lifecycleCheck(lifecycle)
    }
    map.load?.length && map.load.map(async (load: any) => await load())
    app.status = Status.NOT_BOOTSTRAPPED
    app.bootstrap = compose(map.bootstrap.concat(lifecycle.bootstrap))
    app.mount = compose(map.mount.concat(lifecycle.mount))
    app.unmount = compose(map.unmount.concat(lifecycle.unmount))
    delete app.loaded
    return app
  })
  return app.loaded
}

function mapMixin(): Lifecycles {
  const out: any = {
    load: [],
    bootstrap: [],
    mount: [],
    unmouunt: []
  }
  mixins.forEach((item: any) => {
    item.load && out.load.push(item.load)
    item.bootstrap && out.bootstrap.push(item.bootstrap)
    item.mount && out.mount.push(item.mount)
    item.unmount && out.unmount.push(item.unmount)
  })
  return out
}

async function loadShadowDOM(app: App): Promise<HTMLElement> {
  return new Promise<HTMLElement>((resolve) => {
    class Berial extends HTMLElement {
      static get tag(): string {
        return app.name
      }
      connectedCallback(): void {
        resolve(this)
      }
      constructor() {
        super()
        this.attachShadow({ mode: 'open' })
      }
    }
    const hasDef = window.customElements.get(app.name)
    if (!hasDef) {
      customElements.define(app.name, Berial)
    }
  })
}

async function runUnmount(app: App): Promise<App> {
  if (app.status != Status.MOUNTED) {
    return app
  }
  app.status = Status.UNMOUNTING
  await app.unmount(app)
  app.status = Status.NOT_MOUNTED
  return app
}

async function runBootstrap(app: App): Promise<App> {
  if (app.status !== Status.NOT_BOOTSTRAPPED) {
    return app
  }
  app.status = Status.BOOTSTRAPPING
  await app.bootstrap(app)
  app.status = Status.NOT_MOUNTED
  return app
}

async function runMount(app: App): Promise<App> {
  if (app.status !== Status.NOT_MOUNTED) {
    return app
  }
  app.status = Status.MOUNTING
  await app.mount(app)
  app.status = Status.MOUNTED
  return app
}

const captured = {
  hashchange: [],
  popstate: []
} as any

window.addEventListener('hashchange', reroute)
window.addEventListener('popstate', reroute)
const oldAEL = window.addEventListener
const oldREL = window.removeEventListener

window.addEventListener = function (name: any, fn: any): void {
  if (
    (name === 'hashchange' || name === 'popstate') &&
    !captured[name].some((l: any) => l == fn)
  ) {
    captured[name].push(fn)
    return
  }
  // @ts-ignore
  return oldAEL.apply(this, arguments)
}

window.removeEventListener = function (name: any, fn: any): void {
  if (name === 'hashchange' || name === 'popstate') {
    captured[name] = captured[name].filter((l: any) => l !== fn)
    return
  }
  //@ts-ignore
  return oldREL.apply(this, arguments)
}

function patchedUpdateState(updateState: any): () => void {
  return function (): void {
    const urlBefore = window.location.href
    // @ts-ignore
    updateState.apply(this, arguments)
    const urlAfter = window.location.href

    if (urlBefore !== urlAfter) {
      // @ts-ignore
      urlReroute(new PopStateEvent('popstate'))
    }
  }
}

window.history.pushState = patchedUpdateState(window.history.pushState)
window.history.replaceState = patchedUpdateState(window.history.replaceState)
