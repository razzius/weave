// @flow
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
