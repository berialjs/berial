import type { Status } from './entity'

export type Lifecycles = ToArray<Lifecycle>

export type Lifecycle = {
  bootstrap: PromiseFn
  unmount: PromiseFn
  mount: PromiseFn
  load?: PromiseFn
}

export type Mixin = {
  load?: PromiseFn
  mount?: PromiseFn
  unmount?: PromiseFn
  bootstrap?: PromiseFn
}

export type Plugin = (...args: any[]) => any

export type App = {
  name: string
  node: HTMLElement
  url: ((props: App['props']) => Lifecycle) | string
  match: (location: Location) => boolean
  host: DocumentFragment
  props: Record<string, unknown>
  status: Status
  loaded?: any
  store?: any
  loadLifecycle: any
  unmount: PromiseFn
  mount: PromiseFn
  bootstrap: PromiseFn
}

export type PromiseFn = (...args: any[]) => Promise<any>

export type ArrayType<T> = T extends (infer U)[] ? U : T

export type ToArray<T> = T extends Record<any, any>
  ? {
      [K in keyof T]: T[K][]
    }
  : unknown

export type ProxyType = Omit<ProxyConstructor, keyof ProxyConstructor>
