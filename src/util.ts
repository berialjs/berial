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
  return fetch(url, {
    mode: 'cors',
    ...option
  }).then((res) => res.text())
}

export function reverse<T>(arr: T[]): T[] {
  return Array.from(arr).reverse()
}
