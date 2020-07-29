export function chainPromise(
  promiseArray: ((...args: any[]) => Promise<any>)[]
) {
  return promiseArray.reduce((chain: Promise<any>, currentPromiseFn) => {
    return chain.then((p) => {
      return currentPromiseFn(p)
    })
  }, Promise.resolve())
}
