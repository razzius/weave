import subHours from 'date-fns'

export function saveToken(token) {
  window.localStorage.setItem('tokenTimestamp', new Date().toISOString())
  window.localStorage.setItem('token', token)
}

export function loadToken() {
  const tokenTimestamp = window.localStorage.getItem('tokenTimestamp')
  if (tokenTimestamp == null) {
    return null
  }

  const oneHourAgo = subHours(new Date(), 1)

  if (new Date(tokenTimestamp) < oneHourAgo) {
    clearToken()
    return null
  }
  return window.localStorage.getItem('token')
}

export function clearToken() {
  window.localStorage.removeItem('tokenTimestamp')
  window.localStorage.removeItem('token')
}
