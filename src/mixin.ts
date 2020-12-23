import type { Lifecycles, Mixin, Plugin } from './types'

const mixins: Set<Mixin> = new Set()
const plugins: Set<Plugin> = new Set()

export function use(plugin: Plugin, ...args: any[]): void {
  if (!plugins.has(plugin)) {
    plugins.add(plugin)
    plugin(...args)
  }
}

export function mixin(mix: Mixin): void {
  if (!mixins.has(mix)) {
    mixins.add(mix)
  }
}

export function mapMixin(): Lifecycles {
  const out: Lifecycles = {
    load: [],
    bootstrap: [],
    mount: [],
    unmount: []
  }
  mixins.forEach((item: Mixin) => {
    item.load && out.load!.push(item.load)
    item.bootstrap && out.bootstrap.push(item.bootstrap)
    item.mount && out.mount.push(item.mount)
    item.unmount && out.unmount.push(item.unmount)
  })
  return out
}
