import { getGlobalStore } from './app'

export async function loadSandbox(host: HTMLElement) {
  const rawWindow = window as any
  const shadowRoot = patchShadowDOM(host.shadowRoot as any)
  return new Promise(async (resolve) => {
    const iframe = (await loadIframe()) as any
    const proxy = new Proxy(iframe.contentWindow, {
      get(target: any, key: string) {
        switch (key) {
          case 'document':
            return shadowRoot
          case 'globalStore':
            return getGlobalStore()
          default:
            return target[key] || rawWindow[key]
        }
      },
      set(target, key, val) {
        target[key] = val
        return true
      }
    })
    resolve(proxy)
  })
}

async function loadIframe() {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe') as any
    iframe.style.cssText =
      'position: absolute; top: -20000px; width: 1px; height: 1px;'

    document.body.append(iframe)
    iframe.onload = () => resolve(iframe)
  })
}

function patchShadowDOM(shadowRoot: ShadowRoot) {
  return new Proxy(shadowRoot, {
    get(target: any, key: string) {
      return target[key] || (document as any)[key]
    },
    set(target, key, val) {
      target[key] = val
      return true
    }
  })
}
