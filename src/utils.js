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

export function any(values: Array<mixed>) {
  return values.reduce((acc, value) => acc || value, false)
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
