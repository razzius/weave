import React, { Component } from "react"
import AppScreen from "./AppScreen"
import { getParam } from './utils'
import { verifyToken } from './api'
import NextButton from './NextButton'

export default class VerifyEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      verified: null
    }
  }

  componentDidMount() {
    const token = getParam('token')

    verifyToken(token).then((response) => {
      this.setState({verified: response})
      this.props.authenticate(token)
    })
  }

  render() {
    return <AppScreen>
      <h1>Complete email registration</h1>
      {
        this.state.error &&
          <p>{this.state.error}</p>
      }
      {
        this.state.verified &&
        <div>
          <p>Successfully verified {this.state.verified.email}.</p>
          <NextButton
          onClick={() => {this.props.history.push('/edit-profile')}}
          text="Create profile"/>
        </div>
      }
    </AppScreen>
  }
}
