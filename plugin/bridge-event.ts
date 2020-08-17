import { mixin } from 'berial'

export function bridgeEvent(): void {
  mixin({ boostrap })
}

async function boostrap(app): Promise<void> {
  const shadowRoot = app.host.shadowRoot
  const define = Object.defineProperty
  const fromNode = shadowRoot,
    toNode = shadowRoot.host
  BRIDGE_EVENT_NAMES.map((eventName) => {
    fromNode.addEventListener(eventName, (fromEvent) => {
      fromEvent.stopPropagation()
      const Event = fromEvent.constructor
      // @ts-ignore
      const toEvent = new Event(eventName, {
        ...fromEvent,
        bubbles: true,
        cancelable: true,
        composed: true
      })
      const {
        path = [],
        target = path[0],
        srcElement = path[0],
        toElement = path[0],
        preventDefault
      } = fromEvent as any
      define(toEvent, 'path', { get: () => path })
      define(toEvent, 'target', { get: () => target })
      define(toEvent, 'srcElement', { get: () => srcElement })
      define(toEvent, 'toElement', { get: () => toElement })
      define(toEvent, 'preventDefault', {
        value: () => {
          preventDefault.call(fromEvent)
          return preventDefault.call(toEvent)
        }
      })
      toNode.dispatchEvent(toEvent)
    })
  })
}

const BRIDGE_EVENT_NAMES = [
  'abort',
  'animationcancel',
  'animationend',
  'animationiteration',
  'auxclick',
  'blur',
  'change',
  'click',
  'close',
  'contextmenu',
  'doubleclick',
  'error',
  'focus',
  'gotpointercapture',
  'input',
  'keydown',
  'keypress',
  'keyup',
  'load',
  'loadend',
  'loadstart',
  'lostpointercapture',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'pointercancel',
  'pointerdown',
  'pointerenter',
  'pointerleave',
  'pointermove',
  'pointerout',
  'pointerover',
  'pointerup',
  'reset',
  'resize',
  'scroll',
  'select',
  'selectionchange',
  'selectstart',
  'submit',
  'touchcancel',
  'touchmove',
  'touchstart',
  'transitioncancel',
  'transitionend',
  'drag',
  'dragend',
  'dragenter',
  'dragexit',
  'dragleave',
  'dragover',
  'dragstart',
  'drop',
  'focusout'
]
