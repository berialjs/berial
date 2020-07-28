# berial

micro frontend framework

```js
(async (ctx) => {
  const { define } = ctx.berial

  const React = {
    render: (host) => ReactDOM.render(<App msg="react" />, host.shadowRoot)
  }

  const Vue = {
    render: (host) =>
      new Vue({
        el: host.name,
        data: { msg: "vue" },
        template: `<div>{{ msg }}</div>`,
      }),
  }

  define("react-app", React, "#/app1")
  define("vue-app", Vue, "#/app2")
})(window)
```
