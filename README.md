[ci_image]: https://github.com/berialjs/berial/workflows/ci/badge.svg
[ci_url]: https://github.com/berialjs/berial/actions

# berial

[![Build Status][ci_image]][ci_url]

> micro frontend framework.

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
  'two-app',
  'http://localhost:3000/two.html',
  (location) => location.hash === '#/app2'
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
