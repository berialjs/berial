import { Lifecycle, Lifecycles } from './types'

export function warn(trigger: string): void
export function warn(trigger: boolean, msg?: string): void
export function warn(trigger: any, msg?: any): void {
  if (typeof trigger === 'string') msg = trigger
  if (!trigger) return
  throw new Error(`[Berial: Warning]: ${msg}`)
}

export function error(trigger: string): void
export function error(trigger: boolean, msg?: string): void
export function error(trigger: any, msg?: any): void {
  if (typeof trigger === 'string') msg = trigger
  if (!trigger) return
  throw new Error(`[Berial: Error]: ${msg}`)
}

export function request(url: string, option?: RequestInit) {
  if (!window.fetch) {
    error(
      "It looks like that your browser doesn't support fetch. Polyfill is needed before you use it."
    )
  }

  return fetch(url, {
    mode: 'cors',
    ...option
  })
    .then((res) => res.text())
    .then((data) => data)
}

export function defineProperty(
  target: any,
  key: PropertyKey,
  descriptor: PropertyDescriptor
) {
  Object.defineProperty(target, key, descriptor)
}

export function lifecycleCheck(lifecycle: Lifecycle | Lifecycles) {
  const definedLifecycles = new Map<any, boolean>()
  for (const item in lifecycle) {
    definedLifecycles.set(item, true)
  }
  if (!definedLifecycles.has('bootstrap')) {
    error(
      __DEV__,
      `It looks like that you didn't export the lifecycle hook [bootstrap], which would cause a mistake.`
    )
  }
  if (!definedLifecycles.has('mount')) {
    error(
      __DEV__,
      `It looks like that you didn't export the lifecycle hook [mount], which would cause a big mistake.`
    )
  }
  if (!definedLifecycles.has('unmount')) {
    error(
      __DEV__,
      `It looks like that you didn't export the lifecycle hook [unmount], which would cause a mistake.`
    )
  }
}
