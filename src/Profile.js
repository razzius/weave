// @flow
import React, { Component } from 'react'
import { Redirect } from 'react-router'

import AppScreen from './AppScreen'
import { getProfile, type Account } from './api'
import { clearToken } from './persistence'
import ProfileView, { type BaseProfileData } from './ProfileView'

type ProfileData = {|
  id: string,
  dateUpdated: Date,
  starred?: ?boolean,
  ...BaseProfileData,
|}

type ClientError =
  | {
      profile_id: Array<string>,
    }
  | {
      token: Array<string>,
    }

function errorView(error: string | ClientError) {
  if (typeof error === 'string') {
    return error
  }
  if (error.token instanceof Array && error.token[0] === 'unknown token') {
    clearToken()
    return <Redirect to="/login" />
  }
  if (
    error.profile_id instanceof Array &&
    error.profile_id[0] === 'Not found'
  ) {
    return 'Profile not found'
  }

  // According to types, this case does not exist. TODO Revisit
  return String(error)
}

type State = {
  profile: ProfileData | null,
  error: ClientError | null,
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

    if (token === null || id == null) {
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
    const {
      account,
      token,
      match: {
        params: { id },
      },
    } = this.props

    if (id === null) {
      return 'There is no profile id in the URL. Navigate to a profile.'
    }

    const { profile, error } = this.state

    if (error !== null) {
      return errorView(error)
    }

    if (token === null) {
      return 'You are not logged in. Please log in.'
    }

    if (account === null) {
      // Account hasn't loaded yet
      return null
    }

    const { profileId, isAdmin } = account

    if (profile === null) {
      return null
    }

    const ownProfile = profileId === profile.id

    const { dateUpdated, starred, ...baseProfileData } = profile

    return (
      <AppScreen>
        <ProfileView
          isAdmin={isAdmin}
          ownProfile={ownProfile}
          data={baseProfileData}
          profileId={id}
          dateUpdated={dateUpdated}
          token={token}
          starred={starred}
        />
      </AppScreen>
    )
  }
}
