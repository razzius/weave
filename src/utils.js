import React from 'react'
import Promise from 'promise-polyfill'

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

export function caseInsensitiveFind(search, values) {
  const lowercaseSearch = search.toLowerCase()
  return values.find((value) => value.toLowerCase() === lowercaseSearch)
}

export function availableForMentoringFromVerifyTokenResponse(response) {
  return response.profile_id !== null && response.available_for_mentoring
}

export function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

export function LiteralLink({ href }) {
  return <ExternalLink href={href}>{href}</ExternalLink>
}

export function last(values) {
  return values[values.length - 1]
}

export function partition(predicate, values) {
  const satisfies = []
  const fails = []
  values.forEach((value) => {
    if (predicate(value)) {
      satisfies.push(value)
    } else {
      fails.push(value)
    }
  })

  return [satisfies, fails]
}

export function arrayCaseInsensitiveContains(array, value) {
  return array.map((item) => item.toLowerCase()).includes(value.toLowerCase())
}
