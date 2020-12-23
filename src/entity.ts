import type { App } from './types'
import { mapMixin } from './mixin'
import { importHtml } from './html-loader'
import { reverse } from './util'
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

let apps: App[] = []

export function register(appArray: any[]): void {
  appArray.forEach((app: any) => (app.status = Status.NOT_LOADED))
  apps = appArray
  hack()
  reroute()
}

function reroute(): void {
  const { loads, mounts, unmounts } = getAppChanges()
  perform()
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
    const isActive: boolean = app.path(window.location)
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
        break
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
    app.host = await loadShadowDOM(app)
    const { dom, lifecycles } = await importHtml(app)
    app.host?.appendChild(dom)
    app.status = Status.NOT_BOOTSTRAPPED
    app.bootstrap = compose(mixinLife.bootstrap.concat(lifecycles.bootstrap))
    app.mount = compose(mixinLife.mount.concat(lifecycles.mount))
    app.unmount = compose(mixinLife.unmount.concat(lifecycles.unmount))
    delete app.loaded
    return app
  })
  return app.loaded
}

function loadShadowDOM(app: App): Promise<DocumentFragment> {
  return new Promise((resolve, reject) => {
    class Berial extends HTMLElement {
      static get tag(): string {
        return app.name
      }
      constructor() {
        super()
        resolve(this.attachShadow({ mode: 'open' }))
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

function hack(): void {
  window.addEventListener = hackEventListener(window.addEventListener)
  window.removeEventListener = hackEventListener(window.removeEventListener)

  window.history.pushState = hackHistory(window.history.pushState)
  window.history.replaceState = hackHistory(window.history.replaceState)

  window.addEventListener('hashchange', reroute)
  window.addEventListener('popstate', reroute)
}

const captured = {
  hashchange: [],
  popstate: []
} as any

function hackEventListener(func: any): any {
  return function (name: any, fn: any): any {
    if (name === 'hashchange' || name === 'popstate') {
      if (!captured[name].some((l: any) => l == fn)) {
        captured[name].push(fn)
        return
      } else {
        captured[name] = captured[name].filter((l: any) => l !== fn)
        return
      }
    }
    return func.apply(this, arguments as any)
  }
}

function hackHistory(fn: any): () => void {
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
