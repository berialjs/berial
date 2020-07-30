const ANY_OR_NO_PROPERTY = /["'=\w\s]*/
const SCRIPT_URL_RE = new RegExp(
  '<script' +
    ANY_OR_NO_PROPERTY.source +
    '(?:src="(.+?)")' +
    ANY_OR_NO_PROPERTY.source +
    '(?:\\/>|>[\\s]*<\\/script>)?',
  'g'
)
const SCRIPT_CONTENT_RE = new RegExp(
  '<script' + ANY_OR_NO_PROPERTY.source + '>([\\w\\W]+?)</script>',
  'g'
)

function parseScript(html: string) {
  const scriptUrls: string[] = []
  const scripts: string[] = []
  let match
  while ((match = SCRIPT_URL_RE.exec(html))) {
    const captured = match[1].trim()
    if (!captured) continue
    scriptUrls.push(captured)
  }
  while ((match = SCRIPT_CONTENT_RE.exec(html))) {
    const captured = match[1].trim()
    if (!captured) continue
    scripts.push(captured)
  }
  return {
    scriptUrls,
    scripts
  }
}

export default parseScript
