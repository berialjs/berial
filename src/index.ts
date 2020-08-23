import { start, register } from './app'
import { mixin, use } from './mixin'
import { importHtml } from './html-loader'
import { run } from './sandbox'

export const Berial = {
  start,
  register,
  importHtml,
  run,
  mixin,
  use
}

export default Berial

export { start, register, importHtml, run, mixin, use }
