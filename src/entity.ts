import { importHtml, loadScript } from './html-loader'

const hostMap = new Map()

const path = '/a/c'

export class Entity extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
  connectCallback(): void {
    connect(this) // load every entity, wait to load
    if (!this.firstChild && !this.nextElementSibling) {
      //this is the last element
      const stack = path.split('/')
      load(hostMap.get('root'), stack)
    }
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
  //   let p = host
  //   while ((p = p.parentNode)) {
  //     if (p) {
  //       p['b-p'].push(new Promise((r: any) => (host['b-r'] = r)))
  //       p['b-rc'].push(load.bind(null, host))
  //       host.parent = p
  //       break
  //     }
  //   }
  hostMap.set(host.slot || 'root', host)
}

function load(host: any, stack: any): void {
  host.lifecycle.load(host)
  const peek = stack.shift()
  if (peek) {
    const slot = document.createElement('slot')
    slot.innerHTML = `<slot name=${peek}></slot>`
    host.appendChild(slot)
    load(hostMap.get(peek), stack)
  } else {
    // bubbling
    mount(host)
  }
}

function mount(host: any): void {
  host.lifecycle.mount(host)
}
