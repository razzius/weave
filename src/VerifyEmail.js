import React, { Component } from 'react'
import AppScreen from './AppScreen'
import { getParam } from './utils'
import { verifyToken } from './api'
import NextButton from './NextButton'

function getButtonInfo(isMentor, returningUser) {
  if (!isMentor) {
    return {
      buttonText: 'Browse profiles',
      linkUrl: '/browse'
    }
  }
  if (returningUser) {
    return {
      buttonText: 'Continue to home',
      linkUrl: '/'
    }
  }
  return {
    buttonText: 'Create profile',
    linkUrl: '/create-profile'
  }
}

const VerifiedView = (props) => {
  const {
    isMentor,
    returningUser,
    verified,
    history,
    authenticate,
    token,
    profileId,
    availableForMentoring
  } = props

  const { buttonText, linkUrl } = getButtonInfo(isMentor, returningUser)

  const welcomeMessage = returningUser
      ? `Successfully logged in as ${verified.email}.`
      : `Successfully verified ${verified.email}.`

  return (
    <div>
      <p>{welcomeMessage}</p>
      <NextButton
        onClick={() => {
          authenticate({ token, profileId, isMentor, availableForMentoring }).then(() => {
            history.push(linkUrl)
          })
        }}
        text={buttonText}
        />
    </div>
  )
}
export default class VerifyEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      verified: null,
      token: getParam('token'),
      profileId: null
    }
  }

  componentDidMount() {
    verifyToken(this.state.token).then(response => {
      this.setState({
        verified: response,
        profileId: response.profile_id,
        isMentor: response.is_mentor,
        availableForMentoring: response.available_for_mentoring
      })
      window.localStorage.setItem('token', this.state.token)
    }).catch(err => {
      if (err.token[0] === 'not recognized')
        this.setState({error: 'Your token is invalid or has expired. Try signing up or logging in again.'})
    })
  }

  render() {
    const { error, isMentor, profileId, verified, token, availableForMentoring } = this.state

    const { authenticate, history } = this.props

    const errorView = error && <p>{error}</p>

    const returningUser = profileId !== null

    return (
      <AppScreen>
        <h1>Confirm email verification</h1>
        {errorView}
        {this.state.verified && <VerifiedView
                                  isMentor={isMentor}
                                  returningUser={returningUser}
                                  verified={verified}
                                  authenticate={authenticate}
                                  history={history}
                                  token={token}
                                  profileId={profileId}
                                  availableForMentoring={availableForMentoring}
                                  />}
      </AppScreen>
    )
  }
}
