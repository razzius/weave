// @flow
import React, { Component } from 'react'
import AppScreen from './AppScreen'
import { getParam } from './utils'
import { saveToken } from './persistence'
import { verifyToken } from './api'
import VerifiedView from './VerifiedView'

type Props = Object
type State = {| error: string | null |}

export default class VerifyEmail extends Component<Props, State> {
  state = {
    error: null,
  }

  async componentDidMount() {
    const token = getParam('token')
    if (token === null) {
      this.setState({
        error:
          'Your link is missing its token. Check that it is the link from your verification email.',
      })
      return
    }
    const { authenticate } = this.props

    try {
      const account = await verifyToken(token)

      saveToken(token)

      authenticate({
        token,
        account,
      })
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        this.setState({
          error:
            'There was a problem with our server. Please try again in a moment.',
        })
        return
      }

      if (!Array.isArray(err.token)) {
        this.setState({
          error: `Unknown error: ${err.message}`,
        })
        return
      }
      const errorMessage = err.token[0]
      if (errorMessage === 'not recognized') {
        this.setState({
          error: 'Your token is invalid. Try signing up or logging in again.',
        })
      } else if (errorMessage === 'expired') {
        this.setState({
          error: 'Your login token has expired. Try logging in again.',
        })
      }
    }
  }

  render() {
    const { error } = this.state

    const { authenticate, account, history, token } = this.props

    const errorView = error !== null ? <p>{error}</p> : null

    return (
      <AppScreen>
        <h1>Confirm email verification</h1>
        {errorView}
        {account && (
          <VerifiedView
            account={account}
            authenticate={authenticate}
            history={history}
            token={token}
          />
        )}
      </AppScreen>
    )
  }
}
