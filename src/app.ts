import type { App } from './types'
import { mapMixin } from './mixin'
import { importHtml } from './html-loader'
import { lifecycleCheck, reverse } from './util'
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

export function register(name: string, url: string, match: any): void {
  apps.add({
    name,
    url,
    match,
    status: Status.NOT_LOADED
  })
}

export function start(): void {
  started = true
  reroute()
}

function reroute(): Promise<void> {
  const { loads, mounts, unmounts } = getAppChanges()

  return started ? perform() : init()

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
  if (app.loaded) return app.loaded
  app.loaded = Promise.resolve().then(async () => {
    app.status = Status.LOADING
    let mixinLife = mapMixin()
    app.host = loadShadowDOM(app)
    const { lifecycle: selfLife, bodyNode, styleNodes } = await importHtml(app)
    lifecycleCheck(selfLife)
    app.host?.appendChild(bodyNode.content.cloneNode(true))
    for (const k of reverse(styleNodes))
      app.host!.insertBefore(k, app.host!.firstChild)
    app.status = Status.NOT_BOOTSTRAPPED
    app.bootstrap = compose(mixinLife.bootstrap.concat(selfLife.bootstrap))
    app.mount = compose(mixinLife.mount.concat(selfLife.mount))
    app.unmount = compose(mixinLife.unmount.concat(selfLife.unmount))
    delete app.loaded
    return app
  })
  return app.loaded
}

function loadShadowDOM(app: App): any {
  let host = null
  class Berial extends HTMLElement {
    static get tag(): string {
      return app.name
    }
    constructor() {
      super()
      host = this.attachShadow({ mode: 'open' })
    }
  }
  const hasDef = window.customElements.get(app.name)
  if (!hasDef) {
    customElements.define(app.name, Berial)
  }
  return host
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
  return oldAEL.apply(this, arguments as any)
}

window.removeEventListener = function (name: any, fn: any): void {
  if (name === 'hashchange' || name === 'popstate') {
    captured[name] = captured[name].filter((l: any) => l !== fn)
    return
  }
  return oldREL.apply(this, arguments as any)
}

function polyfillHistory(fn: any): () => void {
  return function (): void {
    const before = window.location.href
    fn.apply(window.history, arguments)
    const after = window.location.href
    if (before !== after) {
      new PopStateEvent('popstate')
      reroute()
    }
  }
}

window.history.pushState = polyfillHistory(window.history.pushState)
window.history.replaceState = polyfillHistory(window.history.replaceState)
