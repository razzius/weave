// @flow
import React from 'react'
import { LiteralLink } from './utils'

import { type Account } from './api'
import HomeActions from './HomeActions'

const Home = ({
  token,
  account,
}: {
  token: string | null,
  account: ?Account,
}) => {
  const isMentor = account && account.isMentor
  const profileId = account && account.profileId

  return (
    <div className="Home">
      <p className="error banner" style={{ textAlign: 'center' }}>
        During the current COVID-19 pandemic, we are encouraging mentor and
        mentee pairs to meet over Zoom. All Harvard students and faculty receive
        free Zoom access available at:{' '}
        <LiteralLink href="https://harvard.zoom.us/" />. This recommendation
        will remain active throughout the COVID-19 pandemic. More information
        can be found on the CDC&apos;s website:
        <br />
        <LiteralLink href="https://www.cdc.gov/coronavirus/2019-ncov/index.html" />
      </p>
      <div id="background">
        <div className="App-intro">
          <HomeActions
            token={token}
            isMentor={Boolean(isMentor)}
            profileId={profileId}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
