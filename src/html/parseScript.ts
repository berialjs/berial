const ANY_OR_NO_PROPERTY = /["'=\w\s]*/
export const SCRIPT_URL_RE = new RegExp(
  '<script' +
    ANY_OR_NO_PROPERTY.source +
    '(?:src="(.+?)")' +
    ANY_OR_NO_PROPERTY.source +
    '(?:\\/>|>[\\s]*<\\/script>)?',
  'g'
)
export const SCRIPT_CONTENT_RE = new RegExp(
  '<script' + ANY_OR_NO_PROPERTY.source + '>([\\w\\W]+?)</script>',
  'g'
)
export const SCRIPT_ANY_RE = /<script[^>]*>[\s\S]*?(<\s*\/script[^>]*>)/g

function parseScript(template: string) {
  const scriptURLs: string[] = []
  const scripts: string[] = []
  let match
  while ((match = SCRIPT_URL_RE.exec(template))) {
    const captured = match[1].trim()
    if (!captured) continue
    scriptURLs.push(captured)
  }
  while ((match = SCRIPT_CONTENT_RE.exec(template))) {
    const captured = match[1].trim()
    if (!captured) continue
    scripts.push(captured)
  }
  return {
    scriptURLs,
    scripts
  }
}

export default parseScript
