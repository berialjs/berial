import { fetchURL } from '../utils/fetch'

const loadedHTMLs: Record<string, string> = {}

export const getLoadedHTMLs = () => loadedHTMLs

interface ToBeLoaded {
  name: string
  url: string
}

async function loadHTMLs(toBeLoaded: ToBeLoaded[]) {
  for (const item of toBeLoaded) {
    loadedHTMLs[item.name] = await fetchURL(item.url)
  }
  return loadedHTMLs
}

export default loadHTMLs
