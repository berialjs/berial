# berial

micro frontend framework

```js
const { resolve } = require("path");
const { rejects } = require("assert");

(async (ctx) => {
  const { define} = ctx.berial;

  const One = {
    count: 0,
    render: ({ count }) => `<div>${count}</div>`,
  };

  const Two = {
    name: "132",
    render: ({ name }) =>
      new Promise((resolve) =>
        setTimeout(() => resolve(`<div>${name}</div>`), 1000)
      ),
  };

  define("one-app", One, "#/app1")
  define("two-app", Two, "#/app2")
})(window);
```
