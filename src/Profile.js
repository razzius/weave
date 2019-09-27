// @flow
import React, { Component } from 'react'

import AppScreen from './AppScreen'
import { getProfile } from './api'
import ProfileView, { type ProfileData } from './ProfileView'

type ClientError = {
  profile_id: Array<string>
}

function errorView(error: ClientError) {
  if (error.profile_id[0] === 'Not found') {
    return 'Profile not found'
  }

  return String(error)
}

type State = {
  data: ProfileData | null,
  error: ClientError | null,
}

type Props = {
  profileId: string,
  isAdmin: string,
  token: string,
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
