import React from 'react'
import { Link } from 'react-router-dom'
import { capitalize } from './utils'
import ProfileAvatar from './ProfileAvatar'

const CheckboxIndicator = props => (
  <div style={{ marginTop: '5px', marginBottom: '5px' }}>
    <label>
      <input
        style={{
          marginRight: '6px',
          verticalAlign: 'middle',
          position: 'relative',
          bottom: '1px'
        }}
        disabled
        title={props.title}
        type="checkbox"
        checked={props.checked}
      />
      {props.title}
    </label>
  </div>
)

const ProfileResult = props => {
  const affiliations = (
    <p>
      {props.affiliations.map((affiliation, index) => (
        <span key={affiliation} className="affiliation">
          {index === 0 ? ' ' : ', '}
          {affiliation}
        </span>
      ))}
    </p>
  )

  return (
    <div style={{ paddingBottom: '3em' }}>
      <Link to={`/profiles/${props.id}`} className="profile-result">
        <ProfileAvatar
          profileImageUrl={props.profile_image_url}
          name={props.name}
          size={160}
        />
        <div style={{ flex: '1 1 auto', flexBasis: '400px' }}>
          <h2>{props.name}</h2>
          {affiliations}
          <p className="clinical-interests">
            {props.clinical_specialties.map(interest => (
              <span key={interest} className="clinical interest">
                {' '}{interest}{' '}
              </span>
            ))}
          </p>
          <p>
            {props.professional_interests.map(interest => (
              <span key={interest} className="professional interest">
                {' '}
                {interest}{' '}
              </span>
            ))}
          </p>
        </div>
        <div style={{flexBasis: '200px', flexShrink: '0'}}>
          <div>
            <p>Cadence: {capitalize(props.cadence)}</p>
          </div>

          <CheckboxIndicator
            title="Shadowing"
            checked={props.willing_shadowing}
          />
          <CheckboxIndicator
            title="Networking"
            checked={props.willing_networking}
          />
          <CheckboxIndicator
            title="Goal setting"
            checked={props.willing_goal_setting}
          />
          <CheckboxIndicator
            title="Discuss personal life"
            checked={props.willing_discuss_personal}
          />
          <CheckboxIndicator
            title="Career guidance"
            checked={props.willing_career_guidance}
          />
          <CheckboxIndicator
            title="Student group support"
            checked={props.willing_student_group}
          />
        </div>
      </Link>
    </div>
  )
}

export default ProfileResult
