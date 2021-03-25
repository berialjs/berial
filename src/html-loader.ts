import { request } from './util'
import { runScript } from './sandbox'

const ALL_SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
const SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|')text\/ng-template\3).)*?>.*?<\/\1>/is
const SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/
const SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/
const LINK_TAG_REGEX = /<(link)\s+.*?>/gi
const LINK_IGNORE_REGEX = /.*ignore\s*.*/
const LINK_PRELOAD_OR_PREFETCH_REGEX = /\srel=('|")?(preload|prefetch)\1/
const LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/
const STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi
const STYLE_TYPE_REGEX = /\s+rel=('|")?stylesheet\1.*/
const STYLE_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/
const STYLE_IGNORE_REGEX = /<style(\s+|\s+.+\s+)ignore(\s*|\s+.*)>/i
const HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g
const SCRIPT_IGNORE_REGEX = /<script(\s+|\s+.+\s+)ignore(\s*|\s+.*)>/i

export function getInlineCode(match: any): string {
  const start = match.indexOf('>') + 1
  const end = match.lastIndexOf('<')
  return match.substring(start, end)
}

function hasProtocol(url: string): any {
  return (
    url.startsWith('//') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  )
}

function getEntirePath(path: string, baseURI: string): string {
  return new URL(path, baseURI).toString()
}

export const genLinkReplaceSymbol = (linkHref: any): string =>
  `<!-- link ${linkHref} replaced by import-html-entry -->`
export const genScriptReplaceSymbol = (scriptSrc: any): string =>
  `<!-- script ${scriptSrc} replaced by import-html-entry -->`
export const inlineScriptReplaceSymbol = `<!-- inline scripts replaced by import-html-entry -->`
export const genIgnoreAssetReplaceSymbol = (url: any): string =>
  `<!-- ignore asset ${url || 'file'} replaced by import-html-entry -->`

export function parse(tpl: string, baseURI: string): any {
  let scripts: string[] = []
  const styles: string[] = []
  let entry: any = null

  const template = tpl
    .replace(HTML_COMMENT_REGEX, '')
    .replace(LINK_TAG_REGEX, (match) => {
      const styleType = !!match.match(STYLE_TYPE_REGEX)
      console.log(styleType)
      if (styleType) {
        const styleHref = match.match(STYLE_HREF_REGEX)
        const styleIgnore = match.match(LINK_IGNORE_REGEX)

        if (styleHref) {
          const href = styleHref && styleHref[2]
          let newHref = href
          if (href && !hasProtocol(href)) {
            newHref = getEntirePath(href, baseURI)
          }
          if (styleIgnore) {
            return genIgnoreAssetReplaceSymbol(newHref)
          }

          styles.push(newHref)
          return genLinkReplaceSymbol(newHref)
        }
      }

      const preloadOrPrefetchType = !!match.match(
        LINK_PRELOAD_OR_PREFETCH_REGEX
      )
      if (preloadOrPrefetchType) {
        const linkHref = match.match(LINK_HREF_REGEX)

        if (linkHref) {
          const href = linkHref[2]
          if (href && !hasProtocol(href)) {
            const newHref = getEntirePath(href, baseURI)
            return match.replace(href, newHref)
          }
        }
      }

      return match
    })
    .replace(STYLE_TAG_REGEX, (match) => {
      if (STYLE_IGNORE_REGEX.test(match)) {
        return genIgnoreAssetReplaceSymbol('style file')
      }
      return match
    })
    .replace(ALL_SCRIPT_REGEX, (match) => {
      const scriptIgnore = match.match(SCRIPT_IGNORE_REGEX)
      if (SCRIPT_TAG_REGEX.test(match) && match.match(SCRIPT_SRC_REGEX)) {
        const matchedScriptEntry = match.match(SCRIPT_ENTRY_REGEX)
        const matchedScriptSrcMatch = match.match(SCRIPT_SRC_REGEX)
        let matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2]

        if (entry && matchedScriptEntry) {
          throw new SyntaxError('You should not set multiply entry script!')
        } else {
          if (matchedScriptSrc && !hasProtocol(matchedScriptSrc)) {
            matchedScriptSrc = getEntirePath(matchedScriptSrc, baseURI)
          }

          entry = entry || (matchedScriptEntry && matchedScriptSrc)
        }

        if (scriptIgnore) {
          return genIgnoreAssetReplaceSymbol(matchedScriptSrc || 'js file')
        }

        if (matchedScriptSrc) {
          scripts.push(matchedScriptSrc)
          return genScriptReplaceSymbol(matchedScriptSrc)
        }

        return match
      } else {
        if (scriptIgnore) {
          return genIgnoreAssetReplaceSymbol('js file')
        }
        const code = getInlineCode(match)
        const isPureCommentBlock = code
          .split(/[\r\n]+/)
          .every((line) => !line.trim() || line.trim().startsWith('//'))

        if (!isPureCommentBlock) {
          scripts.push(match)
        }

        return inlineScriptReplaceSymbol
      }
    })

  scripts = scripts.filter((s: string) => !!s)

  return {
    template,
    scripts,
    styles,
    entry: entry || scripts[scripts.length - 1]
  }
}
export async function importHtml(app: any): Promise<any> {
  let template = '',
    scripts,
    styles
  if (app.scripts) {
    scripts = app.scripts || []
    styles = app.styles || []
  } else {
    const tpl = await request(app.url as string)
    let res = parse(tpl, '')
    scripts = res.scripts
    styles = res.styles
    template = res.template
  }

  scripts = await Promise.all(
    scripts.map((s: string) =>
      hasProtocol(s)
        ? request(s)
        : s.endsWith('.js') || s.endsWith('.jsx')
        ? request(window.origin + s)
        : s
    )
  )
  styles = styles.map((s: string) =>
    hasProtocol(s) || s.endsWith('.css')
      ? `<link rel="stylesheet" href="${s}" ></link>`
      : `<style>${s}<style>`
  )
  template = template

  let lifecycles = null
  scripts.forEach(async (script: any) => {
    lifecycles = runScript(script, app.allowList)[app.name]
  })

  const dom = document.createDocumentFragment()
  const body = document.createElement('template')
  let out = ''
  styles.forEach((s: string) => (out += s))
  out += template
  body.innerHTML = out
  dom.appendChild(body.content.cloneNode(true))
  return { dom, lifecycles }
}
