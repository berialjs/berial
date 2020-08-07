const isArr = (x: unknown) => Array.isArray(x)
const isObj = (x: unknown) =>
  Object.prototype.toString.call(x) === '[object Object]'

export function proxy(base: Record<string, any>, onWirte: any) {
  const copy = isArr(base) ? [] : getCleanCopy(base)
  let map = Object.create(null)
  let draft = {
    base,
    copy,
    onWirte
  }
  return new Proxy(base, {
    get(target: any, key: string) {
      if (key === 'IS_BERIAL_SANDBOX') return true
      if (key in map) return map[key]
      if (isObj(base[key]) || isArr(base[key])) {
        map[key] = proxy(base[key], (obj: object) => (copy[key] = obj))
        return map[key]
      } else {
        return copy[key] || target[key]
      }
    },
    set(target, key: string, value) {
      if (isObj(base[key]) || isArr(base[key])) {
        map[key] = proxy(value, (obj: object) => (copy[key] = obj))
      }
      onWirte && onWirte(draft.onWirte)
      copy[key] = value
      return true
    }
  })
}

function getCleanCopy(obj: object) {
  return Object.create(Object.getPrototypeOf(obj))
}
