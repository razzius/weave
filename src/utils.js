// @flow
import React, { type Node } from 'react'
import Promise from 'promise-polyfill'

export function capitalize(text: string) {
  return text[0].toUpperCase() + text.slice(1)
}

export function getParam(param: string): string | null {
  const url = new URL(window.location.href)
  return url.searchParams.get(param)
}

export function when(condition: boolean, promiseCallable: () => Promise) {
  if (condition) {
    return promiseCallable()
  }
  return Promise.resolve(true)
}

export function any(values: Array<mixed>): boolean {
  return values.reduce((acc, value) => Boolean(acc || value), false)
}

export function caseInsensitiveFind(
  search: string,
  values: Array<string>
): ?string {
  const lowercaseSearch = search.toLowerCase()
  return values.find(value => value.toLowerCase() === lowercaseSearch)
}

export function availableForMentoringFromVerifyTokenResponse(response: Object) {
  return response.profile_id === null ? true : response.available_for_mentoring
}

export const ExternalLink = ({
  href,
  children,
}: {
  href: string,
  children: Node,
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

export function LiteralLink({ href }: { href: string }) {
  return <ExternalLink href={href}>{href}</ExternalLink>
}

export function last<T>(values: Array<T>): ?T {
  return values[values.length - 1]
}

export function partition<T>(
  predicate: Function,
  values: Array<T>
): Array<Array<T>> {
  const satisfies = []
  const fails = []
  values.forEach(value => {
    if (predicate(value)) {
      satisfies.push(value)
    } else {
      fails.push(value)
    }
  })

  return [satisfies, fails]
}

export function arrayCaseInsensitiveContains(
  array: Array<string>,
  value: string
) {
  return array.map(item => item.toLowerCase()).includes(value.toLowerCase())
}

export function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
