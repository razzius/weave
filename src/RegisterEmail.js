import React from 'react'
import AppScreen from './AppScreen'
import { sendVerificationEmail } from './api'

export default class RegisterEmail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  submitEmail = e => {
    e.preventDefault()
    sendVerificationEmail(this.state.email)
      .then(() => {
        window.location.href = '/check-email'
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  updateEmail = e => {
    this.setState({ email: e.target.value })
  }

  render() {
    return (
      <AppScreen>
        <h1>Register email</h1>
        <p>
          Please enter your email and we will send you a verification email.
        </p>
        <form onSubmit={this.submitEmail}>
          <p>
            <input name="email" type="email" onChange={this.updateEmail} />
          </p>
          {this.state.error && <p>
            There was a problem with the request. Please wait a moment and try again.
          </p>}
          <button className="button">Send verification email</button>
        </form>
      </AppScreen>
    )
  }
}
