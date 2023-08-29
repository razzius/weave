import React, { Component } from 'react'
import { Redirect } from 'react-router'

import AppScreen from './AppScreen'
import ProfileView from './ProfileView'

function errorView(error) {
  if (typeof error === 'string') {
    return error
  }
  if (error.token instanceof Array && error.token[0] === 'unknown token') {
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

export default class Profile extends Component {
  state = {
    profile: null,
    error: null,
  }

  async componentDidMount() {
    const { profileId, getProfile } = this.props

    if (profileId == null) {
      return
    }

    try {
      const profile = await getProfile(profileId)

      this.setState({ profile })
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        this.setState({
          error:
            'There was a problem with our server. Please try again in a moment.',
        })
        return
      }

      if (error.status === 401) {
        this.setState({ error: 'You are not logged in. Please log in.' })
        return
      }

      const errorJson = await error.json()
      this.setState({ error: errorJson })
    }
  }

  render() {
    const {
      account,
      profileId,
      RoleSpecificProfileView,
      RoleSpecificExpectations,
      browseUrl,
      editUrl,
      adminEditBaseUrl,
    } = this.props

    if (profileId === null) {
      return 'There is no profile profileId in the URL. Navigate to a profile.'
    }

    const { profile, error } = this.state

    if (error !== null) {
      return errorView(error)
    }

    if (account === null) {
      // Account hasn't loaded yet
      return null
    }

    if (profile === null) {
      return null
    }

    const { isAdmin, isMentor } = account

    const ownProfile = account.profileId === profileId

    const { dateUpdated, starred, ...baseProfileData } = profile

    return (
      <AppScreen>
        <ProfileView
          isAdmin={isAdmin}
          isMentor={isMentor}
          ownProfile={ownProfile}
          data={baseProfileData}
          profileId={profileId}
          dateUpdated={dateUpdated}
          starred={starred}
          RoleSpecificProfileView={RoleSpecificProfileView}
          RoleSpecificExpectations={RoleSpecificExpectations}
          browseUrl={browseUrl}
          editUrl={editUrl}
          adminEditBaseUrl={adminEditBaseUrl}
        />
      </AppScreen>
    )
  }
}
