import { inherits } from 'util'

import {importHtml} from './html-loader'

const hostMap = new Map()

export class Entity extends HTMLElement {
  constructor() {
    super()
    init(this)
  }
}

async function init(host: any): void {
    const { lifecycle: selfLife, bodyNode, styleNodes } = await importHtml(host)

}
