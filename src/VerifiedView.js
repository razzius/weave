// @flow
import React from 'react'

import Button from './Button'

import { type Account } from './api'

function getButtonInfo(account: Account) {
  if (!account.isMentor) {
    return {
      buttonText: 'Browse profiles',
      linkUrl: '/browse',
    }
  }
  if (account.profileId !== null) {
    return {
      buttonText: 'Continue to home',
      linkUrl: '/',
    }
  }
  return {
    buttonText: 'Create profile',
    linkUrl: '/create-profile',
  }
}

const welcomeMessage = (account: Account | null): string => {
  if (account === null) return ''

  const returningUser = account.profileId === null

  return returningUser
    ? `Successfully logged in as ${account.email}.`
    : `Successfully verified ${account.email}.`
}

type Props = {
  account: Account,
}

const VerifiedView = (props: Props) => {
  const { account } = props

  const { buttonText, linkUrl } = getButtonInfo(account)

  return (
    <div>
      <p>{welcomeMessage(account)}</p>
      <div>
        {account.isMentor && (
          <iframe
            style={{
              width: '640px',
              height: '360px',
              maxWidth: '100%',
            }}
            src="https://www.youtube.com/embed/6nAUk502ycA?modestbranding=1&rel=0"
            title="Weave tutorial video: How to create a faculty profile"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>
      <Button to={linkUrl} text={buttonText} />
    </div>
  )
}

export default VerifiedView
