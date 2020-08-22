import { start, register } from './app'
import { mixin, use } from './mixin'
import { loadScript, importHtml } from './html-loader'
import { run } from './sandbox'

export const Berial = {
  start,
  register,
  loadScript,
  importHtml,
  run,
  mixin,
  use
}

export default Berial

export { start, register, loadScript, importHtml, run, mixin, use }
