import React, { Component } from 'react'
import { getProfile } from './api'
import ProfileView from './ProfileView'

function errorView(error) {
  if (error.profile_id[0] === 'Not found') {
    return 'Profile not found'
  }

  return String(error)
}

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      error: null
    }

    getProfile(props.token, props.match.params.id)
      .then(data => this.setState({ data }))
      .catch(error => this.setState({ error }))
  }

  render() {
    const { data, error } = this.state
    const ownProfile = data !== null && this.props.profileId === data.id
    return (
      (error !== null && <h4>error: {errorView(error)}</h4>) ||
      // could use spread props below
      (data !== null && <ProfileView ownProfile={ownProfile} data={data} />)
    )
  }
}
