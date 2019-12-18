// @flow
import React, { Component } from 'react'

import AppScreen from './AppScreen'
import { getProfile, type Account } from './api'
import ProfileView, { type BaseProfileData } from './ProfileView'

type ProfileData = {|
  id: string,
  dateUpdated: Date,
  ...BaseProfileData,
|}

type ClientError = {
  profile_id: Array<string>,
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
  profile: ProfileData | null,
  error: string | ClientError | null,
}

type Props = {
  account: Account | null,
  token: string | null,
  match: {
    params: {
      [key: string]: ?string,
    },
  },
}

export default class Profile extends Component<Props, State> {
  state = {
    profile: null,
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
      this.setState({ error: 'You are not logged in. Please log in.' })
      return
    }

    if (id == null) {
      this.setState({
        error: 'There is no profile id in the URL. Navigate to a profile.',
      })
      return
    }

    try {
      const data = await getProfile(token, id)

      const profile = {
        ...data,
        dateUpdated: new Date(data.dateUpdated),
      }
      this.setState({ profile })
    } catch (error) {
      this.setState({ error })
    }
  }

  render() {
    const { profile, error } = this.state

    if (error !== null) {
      return errorView(error)
    }

    const { account } = this.props

    if (account === null) {
      return errorView('You are not logged in. Please log in.')
    }

    const { profileId, isAdmin } = account

    if (profile === null) {
      return null
    }

    const ownProfile = profileId === profile.id

    const { id, dateUpdated, ...baseProfileData } = profile

    return (
      <AppScreen>
        <ProfileView
          isAdmin={isAdmin}
          ownProfile={ownProfile}
          data={baseProfileData}
          profileId={id}
          dateUpdated={dateUpdated}
        />
      </AppScreen>
    )
  }
}
