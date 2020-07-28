# berial

micro frontend

```js
(async (global) => {
  const berial = global.berial

  const One = (props) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          render: [(host) => (host.innerHTML = "111")],
        });
      }, 1000)
    })

  const Two = (props) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          render: [(host) => (host.innerHTML = "222")],
        });
      }, 1000)
    })

  berial.define("one-app", One, "#/app1")
  berial.define("two-app", Two, "#/app2")
})(window)
```
