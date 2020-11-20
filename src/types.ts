export type Lifecycles = ToArray<Lifecycle>

export type Lifecycle = {
  unmount: PromiseFn
  mount: PromiseFn
  load?: PromiseFn
}
export type PromiseFn = (...args: any[]) => Promise<any>

export type ArrayType<T> = T extends (infer U)[] ? U : T

export type ToArray<T> = T extends Record<any, any>
  ? {
      [K in keyof T]: T[K][]
    }
  : unknown

export type ProxyType = Omit<ProxyConstructor, keyof ProxyConstructor>
