import { fetchURL } from '../utils/fetch'
import { REPLACED_BY_BERIAL } from '../constants'
import { SCRIPT_ANY_RE, SCRIPT_URL_RE, SCRIPT_CONTENT_RE } from './parseScript'

const loadedHTMLs: Record<
  string,
  {
    originalTemplate: string
    replacedTemplate: string
  }
> = {}

export const getLoadedHTMLs = () => loadedHTMLs

interface ToBeLoaded {
  name: string
  url: string
}

// Fetch HTMLs on load
async function loadAndReplaceHTMLs(toBeLoaded: ToBeLoaded[]) {
  for (const item of toBeLoaded) {
    const originalTemplate = await fetchURL(item.url)
    loadedHTMLs[item.name] = {
      originalTemplate,
      replacedTemplate: replaceTemplate(originalTemplate)
    }
  }
  return loadedHTMLs
}

function replaceTemplate(template: string) {
  return template.replace(SCRIPT_ANY_RE, scriptReplacer)
}

function scriptReplacer(substring: string) {
  const matchedURL = SCRIPT_URL_RE.exec(substring)
  if (matchedURL) {
    return `<!-- ${REPLACED_BY_BERIAL}Original script: ${matchedURL[1]} -->`
  }
  return `<!-- ${REPLACED_BY_BERIAL}Original script: inline script -->`
}

export default loadAndReplaceHTMLs
