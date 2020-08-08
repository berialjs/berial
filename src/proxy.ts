import { ProxyType } from './types'

const isArr = (x: unknown): boolean => Array.isArray(x)
const isObj = (x: unknown): boolean =>
  Object.prototype.toString.call(x) === '[object Object]'

export function proxy(base: Record<string, any>, onWirte: any): ProxyType {
  const copy = isArr(base) ? [] : getCleanCopy(base)
  let map = Object.create(null)
  let draft = {
    base,
    copy,
    onWirte
  }
  return new Proxy(base, {
    get<T extends string, U extends Record<string, any>>(
      target: U,
      key: T
    ): U[T] | boolean {
      if (key === 'IS_BERIAL_SANDBOX') return true
      if (key in map) return map[key]
      if (isObj(base[key]) || isArr(base[key])) {
        map[key] = proxy(
          base[key],
          (obj: Record<string, unknown>) => (copy[key] = obj)
        )
        return map[key]
      } else {
        return copy[key] || target[key]
      }
    },
    set(target, key: string, value): boolean {
      if (isObj(base[key]) || isArr(base[key])) {
        map[key] = proxy(
          value,
          (obj: Record<string, unknown>) => (copy[key] = obj)
        )
      }
      onWirte && onWirte(draft.onWirte)
      copy[key] = value
      return true
    }
  })
}

function getCleanCopy(obj: Record<string, unknown>) {
  return Object.create(Object.getPrototypeOf(obj))
}
