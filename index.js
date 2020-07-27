const LOAD = 0

let apps = []

export function define(view, route) {
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



  const hasDef = window.customElements.get('berial-app')
  if (!hasDef) {

    customElements.define('berial-app', Berial)
  }

  apps.push({
    view,
    route,
    Berial,
  })

  return invoke()
}

function invoke() {
  const current = window.location.hash

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
      queueJob(module.render, app.Berial)
    })
    .catch((e) => {
      return app
    })
}

function queueJob(queue, Berial) {
  queue.forEach((item) => {
    item(Berial.shadowRoot)
  })
}

window.addEventListener('hashchange', invoke)
window.addEventListener('popstate', invoke)
