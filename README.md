<p align="center"><img src="https://ws1.sinaimg.cn/large/0065Zy9ely1ghc3zeaa2cj308t08tq4p.jpg" alt="berial logo" width="150"></p>
<h1 align="center">Berial</h1>
<p align="center">:imp: Simple micro-front-end framework.</p>
<p align="center">
<a href="https://github.com/berialjs/berial/actions"><img src="https://img.shields.io/github/workflow/status/berialjs/berial/main.svg" alt="Build Status"></a>
<a href="https://npmjs.com/package/berial"><img src="https://img.shields.io/npm/v/berial.svg" alt="npm-v"></a>
<a href="https://npmjs.com/package/berial"><img src="https://img.shields.io/npm/dt/berial.svg" alt="npm-d"></a>
</p>


### Feature

- shadow dom

- scoped css

- js sandbox

- html loader

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

### License

MIT ©yisar ©h-a-n-a
