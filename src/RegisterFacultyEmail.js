import React from 'react'

import AppScreen from './AppScreen'
import SubmitEmailForm from './SubmitEmailForm'
import { sendFacultyVerificationEmail } from './api'

function RegisterFacultyEmail({ history }) {
  return (
    <AppScreen>
      <SubmitEmailForm
        header="Register Email"
        instructions="Please enter your Duke or hospital-affiliated email and we will send you a verification email."
        history={history}
        successMessage="Please check your email to continue registration. You may close this page."
        sendEmail={sendFacultyVerificationEmail}
      />
    </AppScreen>
  )
}

export default RegisterFacultyEmail
