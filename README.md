### unnamed

> 一个微前端模型

目前这个 demo 中，总体机制和 qiankun 类似，都是使用 umd 的打包方式，往 window 变量上挂载生命周期

之所以增加沙箱，是为了解决多个实例共存的污染问题，比如全局变量，事件污染，同一个依赖的版本不统一等等

多个子应用之间，最好不共享状态和依赖，理想状态是各干各的，互不相干

沙箱不对 module federation 进行拦截

module federation 说白了就是将 import() 语法糖引入的 module 挂到一个类似 window 的全局变量上，我们的沙箱不对这个变量做隔离

所以如果需要共享组件/依赖/状态，可以通过 module federation

```js
import { register } from './dist/mfe'

register([
	{
		name: 'child-fre',
    url: 'https://berial-child-fre.vercel.app',
    path: ({ pathname }) => pathname !== '/react' && pathname !== '/vue'

    scripts: [], // 可选
    styles: [], // 可选
	},
	{
		name: 'child-react',
		url: 'https://berial-child-react.vercel.app',
		path: ({ pathname }) => pathname === '/react'
	},
	{
		name: 'child-vue',
		url: 'https://berial-child-vue.vercel.app',
		path: ({ pathname }) => pathname === '/vue'
	}
])
```
