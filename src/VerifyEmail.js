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

export default class VerifyEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      verified: null,
      token: null,
      profileId: null
    }
  }

  componentDidMount() {
    const token = getParam('token')

    verifyToken(token).then(response => {
      this.setState({
        token,
        verified: response,
        profileId: response.profileId,
        isMentor: response.is_mentor
      })
      window.localStorage.set('token', token)
    })
  }

  render() {
    const { error, isMentor, profileId, verified } = this.state

    const errorView = error && <p>{error}</p>

    const returningUser = profileId !== null

    const welcomeMessage = returningUser
      ? `Successfully logged in as ${verified.email}.`
      : `Successfully verified ${verified.email}.`

    const { buttonText, linkUrl } = getButtonInfo(isMentor, returningUser)
    const verifiedView = this.state.verified && (
      <div>
        <p>{welcomeMessage}</p>
        <NextButton
          onClick={() => {
            this.props.authenticate(this.state.token)
            this.props.history.push(linkUrl)
          }}
          text={buttonText}
        />
      </div>
    )

    return (
      <AppScreen>
        <h1>Complete email registration</h1>
        {errorView}
        {verifiedView}
      </AppScreen>
    )
  }
}
