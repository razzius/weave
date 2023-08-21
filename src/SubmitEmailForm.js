import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import { any, getParam } from './utils'
import VALID_DOMAINS from './valid_domains.json'

async function displayError(error, email) {
  if (error.name === 'TypeError') {
    return 'There was a problem with our server. Please try again in a moment.'
  }

  const errorJson = await error.json()
  const emailError = errorJson.email[0]

  if (emailError === 'unregistered') {
    return 'That email has not been registered. Please sign up using the links above.'
  }

  if (emailError === 'claimed') {
    return (
      <>
        That email has already been registered. Please{' '}
        <Link to={`/login?email=${email}`}>log in</Link>.
      </>
    )
  }

  return `Unknown error: ${error}`
}

export default class SubmitEmailForm extends Component {
  state = {
    email: getParam('email') || '',
    isPersonalDevice: false,
    success: false,
    error: null,
  }

  submitEmail = async (e) => {
    e.preventDefault()
    const { email, isPersonalDevice } = this.state
    const { sendEmail } = this.props

    try {
      await sendEmail({
        email,
        isPersonalDevice,
      })
      this.setState({ success: true })
    } catch (error) {
      this.setState({ error: await displayError(error, email) })
    }
  }

  updateEmail = (e) => {
    this.setState({ email: e.target.value })
  }

  render() {
    const { header, instructions, successMessage } = this.props
    const { success, email } = this.state
    if (!success) {
      const { error, isPersonalDevice } = this.state

      const emailValid = any(
        VALID_DOMAINS.map(domain => email.toLowerCase().endsWith(domain))
      )

      return (
        <div>
          <h1>{header}</h1>
          <div>{instructions}</div>
          <form onSubmit={this.submitEmail}>
            <p>
              <input
                name="email"
                type="email"
                onChange={this.updateEmail}
                value={email}
              />
            </p>
            <ReactTooltip place="bottom" id="emailTooltip">
              Please enter your Duke or hospital-affiliated email
            </ReactTooltip>

            {error && <p className="error">{error}</p>}
            <div>
              <input
                type="checkbox"
                value={isPersonalDevice}
                onClick={() =>
                  this.setState({
                    isPersonalDevice: !isPersonalDevice,
                  })
                }
              />
              This is a personal device (stay logged in for 2 weeks)
            </div>
            <div
              id="toggle"
              data-tip
              data-for="emailTooltip"
              data-tip-disable={email === '' || emailValid}
            >
              <button type="submit" disabled={!emailValid} className="button">
                Send verification email
              </button>
            </div>
          </form>
          <div className="validDomains">
            <p>
              Read about how email address validation works on the{' '}
              <a href="/help">Help</a> page.
            </p>
            <p>The following are the allowed email domains:</p>

            {VALID_DOMAINS.map(domain => (
              <div key={domain}>{domain.replace('@', '')}</div>
            ))}
            <p>
              If you have any questions, please email us at{' '}
              <a href="mailto:weave@hms.harvard.edu">weave@hms.harvard.edu</a>.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div>
        <h1>Verification email sent to {email}</h1>
        <p>{successMessage}</p>
      </div>
    )
  }
}
