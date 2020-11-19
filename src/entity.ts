import { importHtml } from './html-loader'

const hostMap = new Map()

const path = '/a/c'
const stack = path.split('/')

export class Entity extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
  connectCallback(): void {
    connect(this) // load every entity, wait to load
    load(this)
  }
}

async function connect(host: any): Promise<any> {
  const { lifecycle, bodyNode, styleNodes } = await importHtml(host)
  const frag = document.createDocumentFragment()
  styleNodes.forEach((s) => frag.appendChild(s))
  frag.appendChild(bodyNode.content.cloneNode(true))
  host.appendChild(frag)
  host.lifecycle = lifecycle
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
      p['b-l'] = 1
    }
  }
  hostMap.set(host.slot || 'root', host)
}

function load(host: any): void {
  host.lifecycle.load(host)
  const name = stack[host['b-l']] // a
  if (name) {
    const slot = document.createElement('slot')
    slot.innerHTML = `<slot name=${name}></slot>`
    host.appendChild(slot)
  }
  host['b-rc'].filter((r: any) => r.slot === name).forEach((r: any) => r())
}

function mount(host: any): void {
  host.lifecycle.mount(host)
}
