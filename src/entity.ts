import { importHtml, loadScript } from './html-loader'

let root: any = null
// const stack = window.location.pathname.split('/')
const stack = ['root', 'a', 'c']

const enum Tags {
  Connected = 1 << 1,
  Loaded = 1 << 2,
  Mounted = 1 << 3,
  Unmounted = 1 << 4
}

export class Entity extends HTMLElement {
  slots: any
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
  connectedCallback(): void {
    connect(this)
  }
  disconnectedCallback(): void {
    unmount(this)
  }
}

async function connect(host: any): Promise<any> {
  if (host.tag & Tags.Connected) return host
  host['b-p'] = []
  host['b-rc'] = []

  // find the neartist parent and push a promise
  let p = host
  while ((p = p.parentNode)) {
    if (p && p['b-p']) {
      host['b-l'] = p['b-l'] + 1
      if (host.slot === stack[host['b-l'] - 1]) {
        p['b-p'].push(new Promise((r: any) => (host['b-r'] = r)))
        p['b-rc'].unshift(mount.bind(null, host))
      }
      break
    } else {
      host['b-l'] = 1
      root = host
    }
  }

  load(host)

  if (p && p['b-p']) {
    Promise.all(p['b-p']).then((res) => {
      mount(p)
      p['b-p'] = null
    })
  }

  if (!host.nextElementSibling && !host.firstChild) {
    p['b-rc'].map((r: any) => r())
  }

  host.tag |= Tags.Connected
  return host
}

async function load(host: any): Promise<any> {
  if (!host.loaded) {
    if (host.path) {
      const { lifecycle, bodyNode, styleNodes } = await importHtml(host)
      const frag = document.createDocumentFragment()
      styleNodes.forEach((s) => frag.appendChild(s))
      frag.appendChild(bodyNode.content.cloneNode(true))
      host.shadowRoot.appendChild(frag)
      host['b-lc'] = lifecycle
    } else {
      const template = document.createElement('template')
      template.innerHTML = `
      <style>.path{color: #3f51b5;padding: 10px;}</style>
      <li class=path> path 参数呢::>_<:: </li>`
      host.shadowRoot.appendChild(template.content.cloneNode(true))
    }
    host.loaded = true
  }
  const name = stack[host['b-l']]
  if (name) {
    const template = document.createElement('template')
    template.innerHTML = `<slot name='${name}'></slot>`
    host.shadowRoot.appendChild(template.content.cloneNode(true))
  }
  if (host.slot === '' || host.slot === stack[host['b-l'] - 1]) {
    host['b-lc'].load(host)
  }
}

function mount(host: any): void {
  if (host.tag & Tags.Mounted) return
  let p = Promise.resolve() as any
  p = host['b-lc'].mount(host)

  if (p && typeof p.then === 'function') {
    p.then(() => {
      host['b-r'] && host['b-r']()
      host.tag |= Tags.Mounted
    })
  } else {
    host['b-r'] && host['b-r']()
    host.tag |= Tags.Mounted
  }
}

function unmount(host: any): void {
  host['b-lc'].unmount(host)
  host.tag = Tags.Loaded
}

function reroute(): void {
  load(root)
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
    const before = window.location.pathname
    fn.apply(window.history, arguments)
    const after = window.location.pathname
    if (before !== after) {
      new PopStateEvent('popstate')
      reroute()
    }
  }
}

window.history.pushState = polyfillHistory(window.history.pushState)
window.history.replaceState = polyfillHistory(window.history.replaceState)
