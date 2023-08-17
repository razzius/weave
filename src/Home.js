// @flow
import React from 'react'

import { getParam } from './utils'
import { type Account } from './api'
import HomeActions from './HomeActions'

const Home = ({ account }: { account: ?Account }) => {
  const isMentor = Boolean(account && account.isMentor)
  const profileId = account && account.profileId

  const welcomeParam = getParam('welcome')

  const welcomeMessage = welcomeParam !== null && account != null && (
    <div className="welcome-wrapper">
      <div className="welcome">
        <div>Welcome, {account.email}.</div>
        <div>
          You have successfully logged in
          {account.isMentor ? ' as faculty' : ' as a student'}.
        </div>
      </div>
    </div>
  )

  return (
    <div className="Home">
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
