// @flow
import { addHours, isAfter } from 'date-fns'
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

export function saveToken(token: string) {
  window.localStorage.setItem('tokenTimestamp', new Date().toISOString())
  window.localStorage.setItem('token', token)
}

export function clearToken() {
  window.localStorage.removeItem('tokenTimestamp')
  window.localStorage.removeItem('token')
}

export function loadToken(): string | null {
  const tokenTimestamp = window.localStorage.getItem('tokenTimestamp')
  if (tokenTimestamp == null) {
    return null
  }

  const whenTokenExpires = addHours(new Date(tokenTimestamp), settings.maxTokenAgeHours)

  if (isAfter(new Date(), whenTokenExpires)) {
    clearToken()
    return null
  }

  return window.localStorage.getItem('token')
}
