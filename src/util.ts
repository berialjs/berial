export function warn(trigger: string): void
export function warn(trigger: boolean, msg?: string): void
export function warn(trigger: any, msg?: any) {
  if (typeof trigger === 'string') msg = trigger
  if (!trigger) return
  throw new Error(`[Berial: Warning]: ${msg}`)
}

export function error(trigger: string): void
export function error(trigger: boolean, msg?: string): void
export function error(trigger: any, msg?: any) {
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
