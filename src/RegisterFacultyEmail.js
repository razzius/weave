import React, { Component } from 'react'
import AppScreen from './AppScreen'
import SubmitEmailForm from './SubmitEmailForm'
import { sendFacultyVerificationEmail } from './api'

export default class RegisterFacultyEmail extends Component {
  render() {
    return (
      <AppScreen>
        <h1>Register email</h1>
        <p>
          Please enter your Harvard or hospital-affiliated email and we will send you a verification email.
        </p>
        <SubmitEmailForm
          history={this.props.history}
          redirectTo='/check-email'
          sendEmail={sendFacultyVerificationEmail}
          />
      </AppScreen>
    )
  }
}
