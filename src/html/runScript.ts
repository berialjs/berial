import { PromiseFn } from '../types'

function runScript(script: string, global: WindowProxy = window) {
  let bootstrap: PromiseFn,
    mount: PromiseFn,
    unmount: PromiseFn,
    update: PromiseFn

  eval(`(function(window) { 
      ${script};
      bootstrap = window.bootstrap;
      mount = window.mount;
      unmount = window.unmount;
      update = window.update;
  })(${global})`)

  // @ts-ignore
  return { bootstrap, mount, unmount, update }
}

export default runScript
