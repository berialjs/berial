export function warn(trigger: boolean | string, msg?: string) {
  if (typeof trigger === 'string') msg = trigger
  if (!trigger) return
  throw new Error(`[Berial: Warning]: ${msg}`)
}

export function error(trigger: boolean | string, msg?: string) {
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
