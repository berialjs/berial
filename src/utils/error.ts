export function warn(trigger: string)
export function warn(trigger: boolean | string, msg?: string) {
  if (typeof trigger === 'string') msg = trigger
  if (!trigger) return
  throw new Error(`[Berial: Warning]: ${msg}`)
}

export function error(trigger: string)
export function error(trigger: boolean | string, msg?: string) {
  if (typeof trigger === 'string') msg = trigger
  if (!trigger) return
  throw new Error(`[Berial: Error]: ${msg}`)
}
