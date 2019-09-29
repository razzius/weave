// @flow
import React, { Component } from 'react'

import AppScreen from './AppScreen'
import { getProfile } from './api'
import ProfileView, { type ProfileData } from './ProfileView'

type ClientError = {
  profile_id: Array<string>
}

function errorView(error: string | ClientError) {
  if (typeof error === 'string') {
    return error
  }
  if (error.profile_id[0] === 'Not found') {
    return 'Profile not found'
  }

  // According to types, this case does not exist. TODO Revisit
  return String(error)
}

type State = {
  data: ProfileData | null,
  error: string | ClientError | null,
}

type Props = {
  profileId: string,
  isAdmin: boolean,
  token: string | null,
  match: {
    params: {
      id: string,
    },
  },
}

export default class Profile extends Component<Props, State> {
  state = {
    data: null,
    error: null,
  }

  async componentDidMount() {
    const {
      token,
      match: {
        params: { id },
      },
    } = this.props

    if (token === null) {
      this.setState({ error: 'You are not logged in. Please log in.'})
      return
    }

    try {
      const data = await getProfile(token, id)
      this.setState({ data })
    } catch (error) {
      this.setState({ error })
    }
  }

  render() {
    const { data, error } = this.state
    const { profileId, isAdmin } = this.props

    if (data === null) {
      return null
    }

    const ownProfile = profileId === data.id

    if (error !== null) {
      return <h4>error: {errorView(error)}</h4>
    }

    return (
      <AppScreen>
        <ProfileView isAdmin={isAdmin} ownProfile={ownProfile} data={data} />
      </AppScreen>
    )
  }
}
