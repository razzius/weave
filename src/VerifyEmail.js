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
      buttonText: 'Edit profile',
      linkUrl: '/edit-profile'
    }
  }
  return {
    buttonText: 'Create profile',
    linkUrl: '/edit-profile'
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
          authenticate(token).then(() => {
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
        profileId: response.profileId,
        isMentor: response.is_mentor
      })
      window.localStorage.setItem('token', this.state.token)
    })
  }

  render() {
    const { error, isMentor, profileId, verified, token } = this.state

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
                                  />}
      </AppScreen>
    )
  }
}
