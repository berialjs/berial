import type { Lifecycles } from './types'

const mixins: any = new Set()
const plugins: any = new Set()

export function use(plugin: (args: any) => any, ...args: any): void {
  if (!plugins.has(plugin)) {
    plugins.add(plugin)
    plugin(args)
  }
}

export function mixin(mix: any): void {
  if (!mixins.has(mix)) {
    mixins.add(mix)
  }
}

export function mapMixin(): Lifecycles {
  const out: any = {
    load: [],
    bootstrap: [],
    mount: [],
    unmount: []
  }
  mixins.forEach((item: any) => {
    item.load && out.load.push(item.load)
    item.bootstrap && out.bootstrap.push(item.bootstrap)
    item.mount && out.mount.push(item.mount)
    item.unmount && out.unmount.push(item.unmount)
  })
  return out
}
