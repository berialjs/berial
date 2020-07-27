# berial

micro frontend

```js
((global) => {
  const berial = global.berial
  const One = {
    render: (host) => (host.innerHTML = '111'),
  }

  const Two = {
    render: (host) => (host.innerHTML = '222'),
  }

  berial.define(load(One), '#/app1')
  berial.define(load(Two), '#/app2')
})(window)
```
