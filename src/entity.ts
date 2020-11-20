import { importHtml } from './html-loader'

const hostMap = new Map()
// const stack = window.location.pathname.split('/')
const stack = ['root', 'a', 'c']

const enum Tags {
  Connected = 1 << 1,
  Loaded = 1 << 2,
  Mounted = 1 << 3,
  Unmounted = 1 << 4
}

export class Entity extends HTMLElement {
  constructor() {
    super()
    // const name = stack[this['b-l']]
    // if (name) {
    //   const template = document.createElement('template')
    //   template.innerHTML = `<slot name=${name}></slot>`
    // }
    this.attachShadow({ mode: 'open' })
  }
  connectedCallback(): void {
    connect(this) // load every entity, wait to load
  }
  disconnectedCallback(): void {
    unmount(this)
  }
}

async function connect(host: any): Promise<any> {
  if (host.tag & Tags.Connected) return host
  if (host.path) {
    const { lifecycle, bodyNode, styleNodes } = await importHtml(host)
    const frag = document.createDocumentFragment()
    styleNodes.forEach((s) => frag.appendChild(s))
    frag.appendChild(bodyNode.content.cloneNode(true))
    host.shadowRoot.appendChild(frag)
    host['b-lc'] = lifecycle
  }
  host['b-p'] = []
  host['b-rc'] = []
  host['b-lc'].load(host)

  // find the neartist parent and push a promise
  let p = host
  while ((p = p.parentNode)) {
    if (p && p['b-p']) {
      p['b-p'].push(new Promise((r: any) => (host['b-r'] = r)))
      p['b-rc'].push(mount.bind(null, host))
      Promise.all(p['b-p']).then((res) => {
        console.log(1)
        mount(p)
      })
      host['b-l'] = p['b-l'] + 1
      break
    } else {
      host['b-l'] = 1
    }
  }
  if (!host.nextElementSibling && !host.firstChild) {
    p['b-rc'].map((r:any) => r())
  }
  hostMap.set(host.slot || 'root', host)
  host.tag |= Tags.Connected
  return host
}

function mount(host: any): void {
  let p = Promise.resolve()
  if (host.tag & Tags.Mounted) {
    p = host['b-lc'].unmount(host)
  }
  p = host['b-lc'].mount(host)

  if (p && typeof p.then === 'function') {
    p.then((res: any) => {
      host['b-r'] && host['b-r'](res)
      host.tag |= Tags.Mounted
    })
  } else {
    host['b-r'] && host['b-r']()
    host.tag |= Tags.Mounted
  }
}

function unmount(host: any): void {
  host['b-lc'].unmout(host)
  host.tag = Tags.Loaded
}

function reroute(): void {
  const root = hostMap.get('root')
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
