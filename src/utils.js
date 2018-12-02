import React from 'react'

export function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1)
}

export function getParam(param) {
  const url = new URL(window.location.href)
  return url.searchParams.get(param)
}

export function when(condition, promiseCallable) {
  if (condition) {
    return promiseCallable()
  }
  return Promise.resolve(true)
}

export function any(values) {
  return values.reduce((acc, value) => acc || value, false)
}

export function availableForMentoringFromVerifyTokenResponse(response) {
  return response.profile_id === null ? true : response.available_for_mentoring
}

export function LiteralLink({href}) {
  return <a href={href}>{href}</a>
}
