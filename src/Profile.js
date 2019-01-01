import React, { Component } from 'react'

import AppScreen from './AppScreen'
import { getProfile } from './api'
import ProfileView from './ProfileView'

function errorView(error) {
  if (error.profile_id[0] === 'Not found') {
    return 'Profile not found'
  }

  return String(error)
}

export default class Profile extends Component {
  state = {
    data: null,
    error: null
  }

  componentDidMount = () => {
    getProfile(this.props.token, this.props.match.params.id)
      .then(data => this.setState({ data }))
      .catch(error => this.setState({ error }))
  }

  render() {
    const { data, error } = this.state
    const ownProfile = data !== null && this.props.profileId === data.id

    if (error !== null) {
      return <h4>error: {errorView(error)}</h4>
    }

    if (data === null) {
      return null
    }

    return (
      <AppScreen>
        <ProfileView ownProfile={ownProfile} data={data} />
      </AppScreen>
    )
  }
}
