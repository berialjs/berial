import { start, register } from './app'
import { mixin, use } from './mixin'
import { loadScript, importHtml } from './html-loader'
import { proxy } from './sanbox'

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
