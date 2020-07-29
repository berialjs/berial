import { App } from './types'
let apps: App[] = []

export function define(
  tag: string,
  component: App['component'],
  route: string
) {
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

      invoke()
    }
  }
  const hasDef = window.customElements.get(tag)
  if (!hasDef) {
    customElements.define(tag, Berial)
  }
}

function invoke() {
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
    app.component.mount(host)
  } else {
    app.component.unmount(host)
  }
}

window.addEventListener('hashchange', invoke)
window.addEventListener('popstate', invoke)
