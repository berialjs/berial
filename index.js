const LOAD = 0

let apps = []

export function define(tag, view, route) {
  class Berial extends HTMLElement {
    constructor() {
      super()
      let template = document.createElement('template')
      template.innerHTML = '<div></div>'
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
    view,
    route,
    node: document.querySlector(tag),
  })

  return invoke()
}

function invoke() {
  const current = window.location.hash || window.location.pathname

  let ps = apps.filter((item) => item.route === current).map(shouldLoad)
  return Promise.all(ps)
    .then(() => {
      return apps
    })
    .catch((e) => {
      console.log(e)
    })
}

function shouldLoad(app) {
  let p = app.view({})
  return p
    .then((module) => {
      queueJob(module.render, app.node)
    })
    .catch((e) => {
      return app
    })
}

function queueJob(queue, node) {
  queue.forEach((item) => {
    item(node.shadowRoot)
  })
}

window.addEventListener('hashchange', invoke)
window.addEventListener('popstate', invoke)
