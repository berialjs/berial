<p align="center"><img src="https://avatars0.githubusercontent.com/u/68577605?s=200&v=4" alt="berial logo" width="150"></p>
<h1 align="center">Berial</h1>
<p align="center">:imp: Simple micro-front-end framework.</p>
<p align="center">
<a href="https://github.com/berialjs/berial/actions"><img src="https://img.shields.io/github/workflow/status/berialjs/berial/ci.svg" alt="Build Status"></a>
<a href="https://npmjs.com/package/berial"><img src="https://img.shields.io/npm/v/berial.svg" alt="npm-v"></a>
<a href="https://npmjs.com/package/berial"><img src="https://img.shields.io/npm/dt/berial.svg" alt="npm-d"></a>
</p>

### Feature

- lifecycle loop

- shadow dom

- scoped css

- proxy sandbox

- html loader

- mixins

### Use

```html
<one-app></one-app>

<two-app></two-app>
```

```js
import { register, start } from 'berial'

register(
  'one-app',
  'http://localhost:3000/one.html',
  (location) => location.hash === '#/app1'
)
register(
  'two-app',
  'http://localhost:3000/two.html',
  (location) => location.hash === '#/app2'
)
start()
```

### mixins

```js
import { mixin } from 'berial'

mixin({
  bootstrap: () => {},
  mount: () => {},
  unmount: () => {}
})
```

mixins will apply all apps

### License

MIT ©yisar ©h-a-n-a
