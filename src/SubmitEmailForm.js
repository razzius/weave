import React, { Component } from 'react'

function displayError(error) {
  if (error === null) {
    return null
  }

  if (error.message === 'Failed to fetch') {
    return (
      <p>There was a problem with our server. Please try again in a moment.</p>
    )
  }

  if (error.email[0] === 'unregistered') {
    return (
      <p>
        That email has not been registered. Please sign up using the links
        above.
      </p>
    )
  }

  return (
    <p>
      {error.email[0]}
    </p>
  )
}

export default class SubmitEmailForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      success: false,
      error: null
    }
  }

  submitEmail = e => {
    e.preventDefault()
    this.props
      .sendEmail(this.state.email)
      .then(() => {
        this.setState({ success: true })
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  updateEmail = e => {
    this.setState({ email: e.target.value })
  }

  render() {
    if (!this.state.success) {
      const { email } = this.state
      const emailValid = email.endsWith('harvard.edu') || email.endsWith('partners.org')

      return (
        <div>
          <h1>{this.props.header}</h1>
          <div>{this.props.instructions}</div>
          <form onSubmit={this.submitEmail}>
            <p>
              <input name="email" type="email" onChange={this.updateEmail} />
            </p>
            {displayError(this.state.error)}
            <div
              data-tip="Please enter your Harvard or hospital-affiliated email"
              data-tip-disable={emailValid}>
              <button
                disabled={!emailValid}
                className="button">Send verification email</button>
            </div>
          </form>
        </div>
      )
    }

    return (
      <div>
        <h1>Verification email sent to {this.state.email}</h1>
        <p>{this.props.successMessage}</p>
      </div>
    )
  }
}