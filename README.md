<p align="center"><img src="https://avatars0.githubusercontent.com/u/68577605?s=200&v=4" alt="berial logo" width="150"></p>
<h1 align="center">Berial</h1>
<p align="center">:imp: Simple micro-front-end framework.</p>
<p align="center">
<a href="https://github.com/berialjs/berial/actions"><img src="https://img.shields.io/github/workflow/status/berialjs/berial/ci.svg" alt="Build Status"></a>
<a href="https://npmjs.com/package/berial"><img src="https://img.shields.io/npm/v/berial.svg" alt="npm-v"></a>
<a href="https://npmjs.com/package/berial"><img src="https://img.shields.io/npm/dt/berial.svg" alt="npm-d"></a>
</p>

### Why Berial

Berial is a new approach to a popular idea: build a javascript framework for front-end microservices.

There are any wonderful features of it, such as Asynchronous rendering pipeline, Web components (shadow DOM + scoped css), JavaScript sandbox (Proxy).

Note: diffence form fre, Berial will pay attention to business value.

### Use

```html
<one-app></one-app>
<two-app></two-app>

<script type="module">
  import { register } from 'berial'
  register([{
    name: 'one-app',
    url: '1.html',
    allowList: ['fre'] // 沙箱白名单
  },{
    name: 'two-app',
    scripts: ['2.js'], // 可选
    styles: ['2.css']
  }])
</script>
```

### License

MIT ©yisar ©h-a-n-a
