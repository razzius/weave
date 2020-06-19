// @flow
import React from 'react'

import { LiteralLink, getParam } from './utils'
import { type Account } from './api'
import HomeActions from './HomeActions'

const Home = ({ account }: { account: ?Account }) => {
  const isMentor = Boolean(account && account.isMentor)
  const profileId = account && account.profileId

  const welcomeParam = getParam('welcome')

  const welcomeMessage = welcomeParam !== null && account != null && (
    <div className="welcome-wrapper">
      <p className="welcome">
        Welcome, {account.email}. You have successfully logged in
        {account.isMentor ? ' as faculty' : ' as a student'}.
      </p>
    </div>
  )

  return (
    <div className="Home">
      <p className="error banner">
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
        {welcomeMessage}
        <div className="App-intro">
          <HomeActions
            account={account}
            isMentor={Boolean(isMentor)}
            profileId={profileId}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
