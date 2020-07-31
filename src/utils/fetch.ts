import { error } from './error'

function request(url: string, option?: RequestInit) {
  if (!window.fetch) {
    error(
      "It looks like that your browser doesn't support fetch. Polyfill is needed before you use it."
    )
  }

  return fetch(url, {
    mode: 'cors',
    ...option
  })
}

export function fetchURL(url: string) {
  const fetchPromise = request(url)
  return fetchPromise.then((response) => {
    return response.text()
  })
}

export default request
