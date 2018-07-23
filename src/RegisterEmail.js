import React, { Component } from 'react'
import AppScreen from './AppScreen'
import SubmitEmailForm from './SubmitEmailForm'

export default class RegisterEmail extends Component {
  render() {
    return (
      <AppScreen>
        <h1>Register email</h1>
        <p>
          Please enter your email and we will send you a verification email.
        </p>
        <SubmitEmailForm history={this.props.history} redirectTo='/check-email'/>
      </AppScreen>
    )
  }
}
