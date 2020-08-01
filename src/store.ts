import { getApps } from './app'

type Store = Record<PropertyKey, any>

let isUpdating = false

export function reactive(store: Store) {
  const reactiveStore = new Proxy(store, {
    get(target, key) {
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      Reflect.set(target, key, value)
      isUpdating = true
      batchUpdate(reactiveStore)
      return true
    }
  })
  return reactiveStore
}

function batchUpdate(store: Store) {
  if (isUpdating) return
  const apps = getApps()
  Promise.resolve().then(() => {
    isUpdating = false
    apps.forEach((app) => {
      app.update(store)
    })
  })
}
