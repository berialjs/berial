let apps = []

export function define(tag, component, route) {
  class Berial extends HTMLElement {
    static get name() {
      return tag
    }

    constructor() {
      super()
      for (const k in component) {
        this[k] = component[k]
      }
    }

    connectedCallback() {
      this.attachShadow({
        mode: 'open',
      })

      apps.push({
        tag,
        component,
        route,
        element: this,
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
        get(target, key) {
          return target[key]
        },
        set(target, key, val) {
          target[key] = val
          process(app, host)
          return true
        },
      })
      process(app,host)
    })
}

function process(app, host) {
  const path = window.location.hash || window.location.pathname || '/'

  if (app.route === path) {
    app.component.mount(host)
  } else {
    app.component.unmount(host)
  }
}

window.addEventListener('hashchange', invoke)
window.addEventListener('popstate', invoke)
