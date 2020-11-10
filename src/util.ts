import type { Lifecycle, Lifecycles } from './types'

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

export function request(url: string, option?: RequestInit): Promise<string> {
  console.log(url)
  if (!window.fetch) {
    error(
      "It looks like that your browser doesn't support fetch. Polyfill is needed before you use it."
    )
  }

  return fetch(url, {
    mode: 'cors',
    ...option
  }).then((res) => res.text())
}

export function lifecycleCheck(lifecycle: Lifecycle | Lifecycles): void {
  const keys = ['bootstrap', 'mount', 'unmount']
  keys.forEach((key) => {
    if (!(key in lifecycle)) {
      error(
        `It looks like that you didn't export the lifecycle hook [${key}], which would cause a mistake.`
      )
    }
  })
}

export function reverse<T>(arr: T[]): T[] {
  return Array.from(arr).reverse()
}

export function nextTick(cb: () => void): void {
  Promise.resolve().then(cb)
}
