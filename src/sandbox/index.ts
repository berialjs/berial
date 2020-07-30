import ProxySandbox from './proxySandbox'

function createSanboxWithLifeCycle(global?: Window) {
  const sandbox = new ProxySandbox(global ?? window)

  const mount = async () => {
    sandbox.activate()
  }

  const unmount = async () => {
    sandbox.deactivate()
  }

  return {
    sandbox,
    mount,
    unmount
  }
}

export default createSanboxWithLifeCycle()
