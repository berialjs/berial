const LOAD = 0

let apps = []

function define(tag, app, route) {
  apps.push({
    tag,
    app,
    route,
    status: LOAD,
  })
  return invoke()
}

function invoke() {
  let ps = apps.map(shouldLoad)
  return Promise.all(ps)
    .then(() => {
      return []
    })
    .catch((e) => {
      console.log(e)
    })
}

function shouldLoad(app) {
  let p = app.loadApp({})
  return p
    .then((module) => {
      app.render = queueJob(module.render)
      return app
    })
    .catch((e) => {
      console.log(e)
      app.status = LOAD_ERROR
      return app
    })
}

function queueJob(queue) {
  return (props) => {
    return new Promise((resolve, reject) => {
      wait(0)
      function wait(i) {
        const fn = queue[i](props)
        fn.then(() => {
          if (i === queue.length - 1) {
            resolve()
          } else {
            wait(i++)
          }
        }).catch((e) => reject(e))
      }
    })
  }
}

function processRoutes() {}
