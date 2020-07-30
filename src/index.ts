import { App } from './types'
let apps: App[] = []

export function register(
  tag: string,
  component: App['component'],
  route: string
): void {
  class Berial extends HTMLElement {
    static get componentName() {
      return tag
    }

    constructor() {
      super()
      for (const k in component) {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(this as any)[k] = (component as any)[k]
      }
    }

    connectedCallback() {
      this.attachShadow({
        mode: 'open'
      })

      apps.push({
        tag,
        component,
        route,
        element: this
      })
    }
  }
  const hasDef = window.customElements.get(tag)
  if (!hasDef) {
    customElements.define(tag, Berial)
  }
}

export function start(): void {
  apps.forEach((app) => {
    const host = new Proxy(app.element, {
      get(target, key: string) {
        return target[key]
      },
      set(target, key: string, val) {
        target[key] = val
        process(app, host)
        return true
      }
    })
    process(app, host)
  })
}

function process(app: App, host: HTMLElement) {
  const path = window.location.hash || window.location.pathname || '/'

  if (app.route === path) {
    ((window)=>{
      app.component.mount(host)
    })(new Sandbox().proxy)
    
  } else {
    app.component.unmount(host)
  }
}

export class Sandbox {
  proxy: ProxyConstructor
  constructor() {
    const raw = window as any
    const fake = {}
    const proxy = new Proxy(fake, {
      get(target: any, key: string) {
        console.log(target)
        return target[key] || raw[key]
      },
      set(target, key, val) {
        target[key] = val
        return true
      }
    })
    this.proxy = proxy
  }
}

window.addEventListener('hashchange', start)
window.addEventListener('popstate', start)
