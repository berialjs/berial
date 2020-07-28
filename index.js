let apps = []

export function define(tag, component, route) {
  class Berial extends HTMLElement {
    constructor() {
      super()
      let template = document.createElement('template')
      template.innerHTML = `<!-- ${tag} -- ${route} -->`
      this.attachShadow({
        mode: 'open',
      }).appendChild(template.content.cloneNode(true))
    }
  }

  const hasDef = window.customElements.get(tag)
  if (!hasDef) {
    customElements.define(tag, Berial)
  }

  apps.push({
    tag,
    component,
    route,
  })

  return invoke()
}

function invoke() {
  const path = window.location.hash || window.location.pathname

  apps.forEach((app) => {
    defer(() => {
      const host = document.querySelector(app.tag)
      if (app.route === path) {
        app.component.mount(host)
      } else {
        app.component.unmount(host)
      }
    })
  })
}

window.addEventListener('hashchange', invoke)
window.addEventListener('popstate', invoke)

var defer = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : setTimeout
