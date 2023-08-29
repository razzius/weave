import React from 'react'

import { Link } from 'react-router-dom'

import AppScreen from './AppScreen'

function NotLoggedIn() {
  return (
    <AppScreen>
      You are not logged in. Click <Link to="/login">here</Link> to login.
    </AppScreen>
  )
}
export default NotLoggedIn
