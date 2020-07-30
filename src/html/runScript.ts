function runScript(script: string, global: WindowProxy = window) {
  let bootstrap: Promise<any>, mount: Promise<any>, unmount: Promise<any>

  eval(`(function(window) { 
      ${script}; 
      bootstrap = window.bootstrap;
      mount = window.mount;
      unmount = window.unmount
  })(global)`)

  // @ts-ignore
  return { bootstrap, mount, unmount }
}

export default runScript
