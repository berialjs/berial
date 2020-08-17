import type { App, Lifecycles } from './types'
import { importHtml } from './html-loader'
import { lifecycleCheck } from './util'
export enum Status {
  NOT_CREATED = 'NOT_CREATED',
  CREATING = 'CREATING',
  NOT_SETUPPED = 'NOT_SETUPPED',
  SETUPPING = 'SETUPPING',
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
    status: Status.NOT_CREATED
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
  if (!mixins.has(mix)) {
    mixins.add(mix)
  }
}

function reroute(): Promise<void> {
  const { creates, mounts, unmounts } = getAppChanges()

  if (started) {
    return perform()
  } else {
    return init()
  }

  async function init(): Promise<void> {
    await Promise.all(creates.map(runCreate))
  }

  async function perform(): Promise<void> {
    unmounts.map(runUnmount)

    creates.map(async (app) => {
      app = await runCreate(app)
      app = await runSetup(app)
      return runMount(app)
    })

    mounts.map(async (app) => {
      app = await runSetup(app)
      return runMount(app)
    })
  }
}

function getAppChanges(): {
  unmounts: App[]
  creates: App[]
  mounts: App[]
} {
  const unmounts: App[] = []
  const creates: App[] = []
  const mounts: App[] = []

  apps.forEach((app: any) => {
    const isActive: boolean = app.match(window.location)
    switch (app.status) {
      case Status.NOT_CREATED:
      case Status.CREATING:
        isActive && creates.push(app)
        break
      case Status.NOT_SETUPPED:
      case Status.SETUPPING:
      case Status.NOT_MOUNTED:
        isActive && mounts.push(app)
        break
      case Status.MOUNTED:
        !isActive && unmounts.push(app)
    }
  })
  return { unmounts, creates, mounts }
}

function compose(
  fns: ((app: App) => Promise<any>)[]
): (app: App) => Promise<void> {
  fns = Array.isArray(fns) ? fns : [fns]
  return (app: App): Promise<void> =>
    fns.reduce((p, fn) => p.then(() => fn(app)), Promise.resolve())
}

async function runCreate(app: App): Promise<any> {
  if (app.created) return app.created
  app.created = Promise.resolve().then(async () => {
    app.status = Status.CREATING
    let mixinLife = mapMixin()
    app.host = (await createShadowDOM(app)) as any
    const { lifecycle: selfLife, bodyNode, styleNodes } = await importHtml(app)
    app.host.shadowRoot?.appendChild(bodyNode.content.cloneNode(true))
    for (const k of styleNodes)
      app.host.shadowRoot!.insertBefore(k, app.host.shadowRoot!.firstChild)
    mixinLife.create?.length &&
      mixinLife.create.forEach(async (create: any) => await create(app))
    app.status = Status.NOT_SETUPPED
    app.setup = compose(mixinLife.setup.concat(selfLife.setup))
    app.mount = compose(mixinLife.mount.concat(selfLife.mount))
    app.unmount = compose(mixinLife.unmount.concat(selfLife.unmount))
    delete app.created
    return app
  })
  return app.created
}

function mapMixin(): Lifecycles {
  const out: any = {
    create: [],
    setup: [],
    mount: [],
    unmount: []
  }
  mixins.forEach((item: any) => {
    item.create && out.create.push(item.create)
    item.setup && out.setup.push(item.setup)
    item.mount && out.mount.push(item.mount)
    item.unmount && out.unmount.push(item.unmount)
  })
  return out
}

async function createShadowDOM(app: App): Promise<HTMLElement> {
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

async function runSetup(app: App): Promise<App> {
  if (app.status !== Status.NOT_SETUPPED) {
    return app
  }
  app.status = Status.SETUPPING
  await app.setup(app)
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
      reroute(new PopStateEvent('popstate'))
    }
  }
}

window.history.pushState = patchedUpdateState(window.history.pushState)
window.history.replaceState = patchedUpdateState(window.history.replaceState)
