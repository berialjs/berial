import { getApps, Status } from './app'

type Store = Record<PropertyKey, any>

let isUpdating = false

export function reactiveStore(store: Store) {
  return new Proxy(store, {
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
}

function batchUpdate(store: Store) {
  if (isUpdating) return
  const apps = getApps()
  Promise.resolve().then(() => {
    isUpdating = false
    apps.forEach(async (app) => {
      app.status = Status.UPDATING
      await app.update(store, apps)
      app.status = Status.UPDATED
    })
  })
}
