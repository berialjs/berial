function request(url: string, option?: RequestInit) {
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
