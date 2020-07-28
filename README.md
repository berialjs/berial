# berial

micro frontend framework

```js
(async (ctx) => {
  const { define, h } = ctx.berial

  const One = {
    count: 0, // props
    render: h`<div>${count}</div>`,
  }

  const Two = {
    user: fetch(`https://api.clicli.me/user`),
    render: h`<div>
      ${h(
        h`loading`, // sync html
        user.then((res) => h`${res.name}`) // async html
      )}
    </div>`,
  };

  define("one-app", One) 
  define("two-app", Two, "#/app2") // route
})(window)
```
