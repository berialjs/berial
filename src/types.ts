import type { Status } from './app'

export type Lifecycles = ToArray<Lifecycle>

export type Lifecycle = {
  bootstrap: PromiseFn
  unmount: PromiseFn
  mount: PromiseFn
  update: PromiseFn
}

export type App = {
  name: string
  entry: ((props: App['props']) => Lifecycle) | string
  match: (location: Location) => boolean
  host: HTMLElement
  props: Record<string, unknown>
  status: Status
  loaded?: any
  store?: any
  loadLifecycle: any
} & Lifecycle

export type PromiseFn = (...args: any[]) => Promise<any>

export type ArrayType<T> = T extends Array<infer U> ? U : T

export type ToArray<T> = T extends Record<any, any>
  ? {
      [K in keyof T]: Array<T[K]>
    }
  : unknown

export type Contains<T> = {
  [P in keyof T]: T[P]
} &
  Record<PropertyKey, unknown>
