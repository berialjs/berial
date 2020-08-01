class Sandbox {
  proxy: ProxyConstructor
  avtiving: boolean
  constructor() {
    this.avtiving = false
    const rawWindow = window as any
    const fakeWindow = {} // to be frame.currentWindow
    const proxy = new Proxy(fakeWindow, {
      get(target: any, key: string) {
        return target[key] || rawWindow[key]
      },
      set(target, key, val) {
        target[key] = val
        return true
      }
    })
    this.proxy = proxy
  }
  active() {
    this.avtiving = true
  }
  inactive() {
    this.avtiving = false
  }
}
