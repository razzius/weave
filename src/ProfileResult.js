// @flow
import React, { Component, Fragment } from 'react'
import MediaQuery from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import { withRouter, Link } from 'react-router-dom'

import { capitalize } from './utils'
import ProfileAvatar from './ProfileAvatar'

const CheckboxIndicator = ({
  title,
  checked,
}: {
  title: string,
  checked: boolean,
}) => {
  const checkbox = (
    <input
      style={{
        marginRight: '6px',
        verticalAlign: 'middle',
        position: 'relative',
        bottom: '1px',
      }}
      disabled
      type="checkbox"
      checked={checked}
    />
  )

  return (
    <Fragment>
      <MediaQuery query="(min-device-width: 750px)">
        <div style={{ marginTop: '5px', marginBottom: '5px' }}>
          {checkbox}
          {title}
        </div>
      </MediaQuery>
      <MediaQuery query="(max-device-width: 750px)">
        <button
          type="button"
          onClick={e => {
            e.preventDefault()
            ReactTooltip.show()
          }}
          data-tip={title}
          data-for="indicator"
        >
          {checkbox}
        </button>
      </MediaQuery>
    </Fragment>
  )
}

type Props = {
  id: number,
  affiliations: Array<string>,
  imageUrl: string,
  name: string,
  degrees: Array<string>,
  clinicalSpecialties: Array<string>,
  professionalInterests: Array<string>,
  cadence: string,
  willingShadowing: boolean,
  willingNetworking: boolean,
  willingGoalSetting: boolean,
  willingDiscussPersonal: boolean,
  willingCareerGuidance: boolean,
  willingStudentGroup: boolean,
  browseState: Object,
}

class ProfileResult extends Component<State, Props> {
  state = {
    scrollY: 0,
  }

  render() {
    const {
      id,
      affiliations,
      imageUrl,
      name,
      degrees,
      clinicalSpecialties,
      professionalInterests,
      cadence,
      willingShadowing,
      willingNetworking,
      willingGoalSetting,
      willingDiscussPersonal,
      willingCareerGuidance,
      willingStudentGroup,
      browseState, // for history
    } = this.props

    const { scrollY } = this.state

    const formattedAffiliations = (
      <p>
        {affiliations.map((affiliation, index) => (
          <span key={affiliation} className="affiliation">
            {index === 0 ? ' ' : ', '}
            {affiliation}
          </span>
        ))}
      </p>
    )

    const degreesView = degrees.length ? (
      <span className="resultDegrees">{`, ${degrees.join(', ')}`}</span>
    ) : null

    return (
      <div style={{ paddingBottom: '3em' }}>
        <div className="profile-result">
          <Link
            className="profile-result-link"
            to={{
              pathname: `/profiles/${id}`,
              state: { ...browseState, scrollY },
            }}
            onMouseOver={() => {
              this.setState({ scrollY: window.scrollY })
            }}
            onFocus={() => {
              this.setState({ scrollY: window.scrollY })
            }}
          >
            <ProfileAvatar imageUrl={imageUrl} name={name} size={160} />
            <div style={{ flexGrow: '0', flexShrink: '0', width: '400px' }}>
              <h2>
                {name}
                {degreesView}
              </h2>
              {formattedAffiliations}
              <p className="clinical-interests">
                {clinicalSpecialties.map(interest => (
                  <span key={interest} className="clinical interest">
                    {' '}
                    {interest}{' '}
                  </span>
                ))}
              </p>
              <p>
                {professionalInterests.map(interest => (
                  <span key={interest} className="professional interest">
                    {' '}
                    {interest}{' '}
                  </span>
                ))}
              </p>
            </div>

            <div
              className="profile-result-right"
              style={{
                flexBasis: '200px',
                flexGrow: '0',
                flexShrink: '0',
                textAlign: 'left',
              }}
            >
              <div>
                <p>Cadence: {capitalize(cadence)}</p>
              </div>

              <CheckboxIndicator title="Shadowing" checked={willingShadowing} />
              <CheckboxIndicator
                title="Networking"
                checked={willingNetworking}
              />
              <CheckboxIndicator
                title="Goal setting"
                checked={willingGoalSetting}
              />
              <CheckboxIndicator
                title="Discuss personal life"
                checked={willingDiscussPersonal}
              />
              <CheckboxIndicator
                title="Career guidance"
                checked={willingCareerGuidance}
              />
              <CheckboxIndicator
                title="Student group support"
                checked={willingStudentGroup}
              />
            </div>
          </Link>
        </div>
      </div>
    )
  }
}

export default withRouter(ProfileResult)
