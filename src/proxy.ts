const INTERNAL_STATE_KEY = Symbol('state')
const isArr = (x: unknown): x is Array<any> => Array.isArray(x)
const isObj = (x: unknown): x is object =>
  Object.prototype.toString.call(x) === '[object Object]'

export function proxy(
  original: Record<string, unknown>,
  onWrite: any,
  host: any
) {
  const draftValue = isArr(original) ? [] : getCleanCopy(original)
  let proxiedKeyMap = Object.create(null)
  let draftState = {
    originalValue: original,
    draftValue,
    mutated: false,
    onWrite
  }
  const draft = new Proxy(original, {
    get(target, key, receiver) {
      if (key === INTERNAL_STATE_KEY) return draftState

      if (key in proxiedKeyMap) return proxiedKeyMap[key]

      if (isObj(original[key as any]) && original[key as any] !== null) {
        proxiedKeyMap[key] = proxyProp(original[key as any], key, draftState)
        return proxiedKeyMap[key]
      } else {
        if (draftState.mutated) return draftValue[key]
        switch (key) {
          case 'document':
            return host.ShadowRoot
          default:
            return Reflect.get(target, key, receiver)
        }
      }
    },
    set(target, key, value) {
      if (isObj(value)) {
        proxiedKeyMap[key] = proxyProp(value, key, draftState)
      }
      copyOnWrite(draftState)

      draftValue[key] = value

      return true
    },
    has(_, ...args) {
      return Reflect.has(getTarget(draftState), ...args)
    },
    ownKeys(_, ...args) {
      return Reflect.ownKeys(getTarget(draftState), ...args)
    },
    getOwnPropertyDescriptor(_, ...args) {
      return Reflect.getOwnPropertyDescriptor(getTarget(draftState), ...args)
    },
    getPrototypeOf(_, ...args) {
      return Reflect.getPrototypeOf(original, ...args)
    },
    deleteProperty(_, ...args) {
      copyOnWrite(draftState)
      return Reflect.deleteProperty(draftValue, ...args)
    },
    defineProperty(_, ...args) {
      copyOnWrite(draftState)
      return Reflect.defineProperty(draftValue, ...args)
    },
    setPrototypeOf(_, ...args) {
      copyOnWrite(draftState)
      return Reflect.setPrototypeOf(draftValue, ...args)
    }
  })
  return draft
}

function proxyProp(props: any, key: any, host: any) {
  const { originalValue, draftValue, onWrite } = host
  return proxy(
    props,
    (value: any) => {
      if (!draftValue.mutated) {
        host.mutated = true
        copyProps(draftValue, originalValue)
      }
      draftValue[key] = value
      if (onWrite) {
        onWrite(draftValue)
      }
    },
    null
  )
}

function copyOnWrite(draftState: any) {
  const { originalValue, draftValue, mutated, onWrite } = draftState
  if (!mutated) {
    draftState.mutated = true
    if (onWrite) {
      onWrite(draftValue)
    }
    copyProps(draftValue, originalValue)
  }
}

function copyProps(target: any, source: any) {
  if (isArr(target)) {
    for (let i = 0; i < source.length; i++) {
      if (!(i in target)) {
        target[i] = source[i]
      }
    }
  } else {
    Reflect.ownKeys(source).forEach((key) => {
      const desc = Object.getOwnPropertyDescriptor(source, key) as any
      if (!(key in target)) {
        Object.defineProperty(target, key, desc)
      }
    })
  }
}

function getTarget(draftState: any) {
  return draftState.mutated ? draftState.draftValue : draftState.originalValue
}

function getCleanCopy(obj: any) {
  return Object.create(Object.getPrototypeOf(obj))
}
