import React from 'react'
import AppScreen from './AppScreen'
import { Link } from "react-router-dom"

export default () => (
  <AppScreen>
    <h1>Login to edit mentor profile</h1>
    <p>Enter your email and we will confirm your account by sending a verification email.</p>
    <p>
      <Link to="/faculty-expectations">If you haven't signed up yet, start here.</Link>
    </p>
    <form>
      <p>
        <input name="email" type="email"/>
      </p>
      <p>
        <button className="button">Send verification email</button>
      </p>
    </form>
  </AppScreen>
)

