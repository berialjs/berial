export async function loadSandbox(host: any): Promise<unknown> {
  const rawWindow = window as any
  const shadowRoot = patchShadowDOM(host.shadowRoot as any)
  return new Promise(async (resolve) => {
    const iframe = (await loadIframe()) as any
    const proxy = new Proxy(iframe.contentWindow, {
      get(target: any, key: string): any {
        switch (key) {
          case 'document':
            return shadowRoot
          case 'store':
            return host.store
          default:
            return key in target ? target[key] : rawWindow[key]
        }
      },
      set(target, key, val): boolean {
        target[key] = val
        return true
      }
    })
    resolve(proxy)
  })
}

async function loadIframe(): Promise<unknown> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe') as any
    iframe.style.cssText =
      'position: absolute; top: -20000px; width: 1px; height: 1px;'

    document.body.append(iframe)
    iframe.onload = (): void => resolve(iframe)
  })
}

function patchShadowDOM(shadowRoot: ShadowRoot): any {
  return new Proxy(shadowRoot, {
    get(target: any, key: string): any {
      return key in target ? target[key] : (document as any)[key]
    },
    set(target, key, val): boolean {
      target[key] = val
      return true
    }
  })
}
