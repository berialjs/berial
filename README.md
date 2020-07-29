# berial

micro frontend framework

```js
(async (ctx) => {
  const { register } = ctx.berial

  const React = {
    render: host => ReactDOM.render(<App msg="react" />, host.shadowRoot)
  }

  const Vue = {
    render: host =>
      new Vue({
        el: host.name,
        data: { msg: "vue" },
        template: `<div>{{ msg }}</div>`,
      }),
  }

  register("react-app", React, "#/app1")
  register("vue-app", Vue, "#/app2")
})(window)
```
