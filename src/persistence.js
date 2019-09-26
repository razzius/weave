import { subHours } from 'date-fns'
import settings from './settings'

function pluralizeHour() {
  return settings.maxTokenAgeHours === 1 ? 'hour' : 'hours'
}

export function loggedOutNotification() {
  // eslint-disable-next-line no-alert
  alert(
    `For your security, you have been logged out due to reaching a maximum time of ${
      settings.maxTokenAgeHours
    } ${pluralizeHour()} since initial log in. You may log in again.`
  )
}

export function saveToken(token) {
  window.localStorage.setItem('tokenTimestamp', new Date().toISOString())
  window.localStorage.setItem('token', token)
}

export function clearToken() {
  window.localStorage.removeItem('tokenTimestamp')
  window.localStorage.removeItem('token')
}

export function loadToken() {
  const tokenTimestamp = window.localStorage.getItem('tokenTimestamp')
  if (tokenTimestamp == null) {
    return null
  }

  const oneHourAgo = subHours(new Date(), settings.maxTokenAgeHours)

  if (new Date(tokenTimestamp) < oneHourAgo) {
    clearToken()
    return null
  }
  return window.localStorage.getItem('token')
}
