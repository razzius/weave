// @flow
import React, { Component, type Node } from 'react'

import { Link } from 'react-router-dom'

import AppScreen from './AppScreen'
import { getParam } from './utils'
import { verifyToken } from './api'
import VerifiedView from './VerifiedView'

type Props = Object
type State = {| error: string | Node | null |}

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

      authenticate({ account })
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        this.setState({
          error:
            'There was a problem with our server. Please try again in a moment.',
        })
        return
      }

      const errorJson = await error.json()

      if (!Array.isArray(errorJson.token)) {
        this.setState({
          error: `Unknown error: ${errorJson.message}`,
        })
        return
      }
      const errorMessage = errorJson.token[0]
      if (errorMessage === 'not recognized') {
        this.setState({
          error: 'Your token is invalid. Try signing up or logging in again.',
        })
      } else if (errorMessage === 'already verified') {
        this.setState({
          error: (
            <div>
              <p>
                The email verification link you have provided has already been
                used. For your security, each link is only valid for one login.
              </p>
              <p>
                <Link to="/login">Log in</Link> again for a new link.
              </p>
            </div>
          ),
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
