import type { Status } from './app'

export type Lifecycles = ToArray<Lifecycle>

export type Lifecycle = {
  setup: PromiseFn
  unmount: PromiseFn
  mount: PromiseFn
  create?: PromiseFn
}

export type App = {
  name: string
  entry: ((props: App['props']) => Lifecycle) | string
  match: (location: Location) => boolean
  host: HTMLElement
  props: Record<string, unknown>
  status: Status
  created?: any
  store?: any
  loadLifecycle: any
  unmount: PromiseFn
  mount: PromiseFn
  update: PromiseFn
  setup: PromiseFn
}

export type PromiseFn = (...args: any[]) => Promise<any>

export type ArrayType<T> = T extends (infer U)[] ? U : T

export type ToArray<T> = T extends Record<any, any>
  ? {
      [K in keyof T]: T[K][]
    }
  : unknown

export type ProxyType = Omit<ProxyConstructor, keyof ProxyConstructor>
