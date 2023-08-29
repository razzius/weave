import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'

import ProfileAvatar from './ProfileAvatar'
import ProfileStar from './ProfileStar'

class ProfileResult extends Component {
  state = {
    scrollY: 0,
  }

  render() {
    const {
      result,
      browseState, // for history
      profileBaseUrl,
      RoleSpecificProfileResult,
    } = this.props

    const { scrollY } = this.state

    return (
      <div style={{ paddingBottom: '3em' }}>
        <div className="profile-result">
          <Link
            className="profile-result-link"
            to={{
              pathname: `/${profileBaseUrl}/${result.id}`,
              state: { ...browseState, scrollY },
            }}
            onMouseOver={() => {
              this.setState({ scrollY: window.scrollY })
            }}
            onFocus={() => {
              this.setState({ scrollY: window.scrollY })
            }}
          >
            {result.starred && <ProfileStar active />}
            <ProfileAvatar
              imageUrl={result.imageUrl}
              name={result.name}
              size={160}
            />
            <RoleSpecificProfileResult result={result} />
          </Link>
        </div>
      </div>
    )
  }
}

export default withRouter(ProfileResult)
