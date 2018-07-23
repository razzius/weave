export function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1)
}

export function getParam(param) {
  const url = new URL(window.location.href)
  return url.searchParams.get(param)
}

export function when(condition, promiseCallable) {
  if (condition) {
    return promiseCallable
  }
  return Promise.resolve(true)
}
