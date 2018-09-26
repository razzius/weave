import React from 'react'
import { Link } from 'react-router-dom'
import { capitalize } from './utils'
import ProfileAvatar from './ProfileAvatar'

const ProfileResult = props => (
  <Link
    to={`/profiles/${props.id}`}
    className="profile-result"
    params={{ test: 'tricky' }}
  >
    <ProfileAvatar
      profileImageUrl={props.profile_image_url}
      name={props.name}
    />
    <div style={{ width: '400px' }}>
      <h2>{props.name}</h2>
      <p>
        {props.affiliations.map(affiliation => (
          <span key={affiliation} className="affiliation">
            {' '}
            {affiliation}{' '}
          </span>
        ))}
      </p>
      <p className="clinical-interests">
        {props.clinical_specialties.map(interest => (
          <span key={interest} className="clinical interest">
            {' '}
            {interest.replace(/ /g, '\u00a0')}{' '}
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
    <div className="profile-result-right">
      <p>{capitalize(props.cadence)}</p>
      <input
        disabled
        title="Shadowing"
        type="checkbox"
        checked={props.willing_shadowing}
      />
      <input
        disabled
        title="Networking"
        type="checkbox"
        checked={props.willing_networking}
      />
      <input
        disabled
        title="Goal setting"
        type="checkbox"
        checked={props.willing_goal_setting}
      />
      <input
        disabled
        title="Personal life"
        type="checkbox"
        checked={props.willing_discuss_personal}
      />
      <input
        disabled
        title="Career guidance"
        type="checkbox"
        checked={props.willing_career_guidance}
      />
      <input
        disabled
        title="Student group support"
        type="checkbox"
        checked={props.willing_student_group}
      />
    </div>
  </Link>
)

export default ProfileResult
