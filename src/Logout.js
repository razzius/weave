import React, { Component } from 'react'
import AppScreen from './AppScreen'

export default class Logout extends Component {
  componentDidMount() {
    this.props.authenticate(null)
  }

  render() {
    return <AppScreen>
      <h1>Logged out</h1>
    </AppScreen>
  }
}
