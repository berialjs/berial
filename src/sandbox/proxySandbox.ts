import { warn } from '../utils/error'

class ProxySandbox {
  isActivated = false
  proxyWindow: Record<PropertyKey, any>
  constructor(public global: Window) {
    const originalWindow = window
    const proxyWindow = createProxyWindow(global)
    this.proxyWindow = new Proxy(proxyWindow, {
      get: (target, key) => {
        if (!this.isActivated) {
          warn(
            __DEV__,
            `Trying to get properties of proxyWindow while sandbox was deactivated is not an expected behavior. Please file an issue if you see this.`
          )
        }
        return proxyWindow[key as string] || originalWindow[key as keyof Window]
      },
      set: (target, key, value) => {
        if (!this.isActivated) {
          warn(
            __DEV__,
            `Trying to set properties of proxyWindow while sandbox was deactivated is not an expected behavior. Please file an issue if you see this.`
          )
        }

        proxyWindow[key as string] = value
        return true
      },
      defineProperty: (...args) => {
        if (!this.isActivated) {
          warn(
            __DEV__,
            `Trying to define properties of proxyWindow while sandbox was deactivated is not an expected behavior. Please file an issue if you see this.`
          )
        }

        Reflect.defineProperty(...args)
        return true
      }
    })
  }

  activate() {
    this.isActivated = true
  }

  deactivate() {
    this.isActivated = false
  }
}

function createProxyWindow(global: Window) {
  const proxyWindow: Record<PropertyKey, any> = {}
  Object.getOwnPropertyNames(global).forEach((name) => {
    const nameDescriptor = Object.getOwnPropertyDescriptor(global, name)
    // Skip configurable properties
    if (!nameDescriptor || nameDescriptor.configurable) return
    Object.defineProperty(proxyWindow, name, nameDescriptor)
  })
  return proxyWindow
}

export default ProxySandbox
