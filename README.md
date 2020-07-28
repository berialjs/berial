# berial

micro frontend framework

```js
(async (ctx) => {
  const { define, h } = ctx.berial

  const One = {
    count: 0, // props
    render: ({count}) => h`<div>${count}</div>`,
  }

  const Two = {
    user: fetch(`https://api.clicli.me/user`),
    render: ({user}) => h`<div>
      ${h(
        h`loading`, // sync html
        user.then(({name}) => h`${name}`) // async html
      )}
    </div>`,
  };

  define("one-app", One) 
  define("two-app", Two, "#/app2") // route
})(window)
```
