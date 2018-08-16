import React from 'react'
import { Link } from 'react-router-dom'

import AppScreen from './AppScreen'
import SubmitEmailForm from './SubmitEmailForm'
import { sendLoginEmail } from './api'

const instructions = <div>
  <p>
    Enter your Harvard or hospital-affiliated email and we will confirm your
    account by sending a verification email.
  </p>
  <p>
    If you have not signed up yet, please start
    {' '}
    <Link to="/faculty-expectations">here</Link>
    {' '}
    for mentors or
    {' '}
    <Link to="/student-expectations">here</Link>
    {' '}
    for mentees.
  </p>
</div>

const Login = props => (
  <AppScreen>
    <SubmitEmailForm
      header="Login"
      history={props.history}
      instructions={instructions}
      successMessage="Please check your email and follow the link from there to log in."
      sendEmail={sendLoginEmail}
    />
  </AppScreen>
)

export default Login
