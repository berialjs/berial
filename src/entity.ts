import { importHtml } from './html-loader'

const hostMap = new Map()
const stack = window.location.pathname.split('/')

const enum Tags {
  Connected = 1 << 1,
  Loaded = 1 << 2,
  Mounted = 1 << 3,
  Unmounted = 1 << 4
}

export class Entity extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
  connectCallback(): void {
    connect(this) // load every entity, wait to load
    load(this)
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

  // find the neartist parent and push a promise
  let p = host
  while ((p = p.parentNode)) {
    if (p && p['b-p']) {
      p['b-p'].push(new Promise((r: any) => (host['b-r'] = r)))
      p['b-rc'].push(load.bind(null, host))
      host['b-l'] = p['b-l'] + 1
      break
    } else {
      host['b-l'] = 1
    }
  }
  hostMap.set(host.slot || 'root', host)
  host.tag |= Tags.Connected
  return host
}

function load(host: any): void {
  if (host.tag & Tags.Loaded) return host
  host['b-lc'].load(host)
  const name = stack[host['b-l']] // a
  if (name) {
    const slot = document.createElement('slot')
    slot.innerHTML = `<slot name=${name}></slot>`
    host.appendChild(slot)
    const match = (r: any): boolean => r.slot === name
    host['b-rc'].filter(match).forEach((r: any) => r())
    Promise.all(host['b-rc'].filter(match)).then((): void => {
      host.tag |= Tags.Loaded
      mount(host)
    })
  } else {
    host.tag |= Tags.Loaded
    mount(host)
  }
}

function mount(host: any): void {
  if (host.tag & Tags.Mounted) {
    host['b-lc'].unmount(host)
  }
  host['b-lc'].mount(host).then((res: any) => {
    host['b-r'] && host['b-r'](res)
    host.tag |= Tags.Mounted
  })
}

function unmount(host: any): void {
  host['b-lc'].unmout(host)
  host.tag = Tags.Loaded
}

function reroute(): void {
  const root = hostMap.get('root')
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
