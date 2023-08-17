// @flow
import React from 'react'
import { type RouterHistory } from 'react-router-dom'

import AppScreen from './AppScreen'
import SubmitEmailForm from './SubmitEmailForm'
import { sendStudentVerificationEmail } from './api'

const RegisterStudentEmail = ({ history }: { history: RouterHistory }) => (
  <AppScreen>
    <SubmitEmailForm
      header="Register Email"
      instructions="Please enter your Duke or hospital-affiliated email and we will send you a verification email."
      history={history}
      successMessage="Please check your email to continue registration. You may close this page."
      sendEmail={sendStudentVerificationEmail}
    />
  </AppScreen>
)

export default RegisterStudentEmail
