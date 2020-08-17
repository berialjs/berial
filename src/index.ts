import { start, register, mixin, use } from './app'
import { loadScript, importHtml } from './html-loader'
import { proxy } from './proxy'

export const Berial = {
  start,
  register,
  loadScript,
  importHtml,
  proxy,
  mixin,
  use
}

export default Berial

export { start, register, loadScript, importHtml, proxy, mixin, use }
