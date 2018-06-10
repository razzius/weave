import React from "react"
import { Link } from "react-router-dom"
import { capitalize } from './utils'

export default props => {
  return (
    <Link
      to={`/profiles/${props.id}`}
      className="profile-result"
      params={{ test: "tricky" }}
    >
      <img alt="Profile" className="profile-image" src={props.profile_image_url} />
      <div style={{width: '400px'}}>
        <h2>{props.name}</h2>
        <p>
          {props.affiliations.map(affiliation => (
            <span key={affiliation} className="affiliation">
              {" "}
              {affiliation}{" "}
            </span>
          ))}
        </p>
        <p className="clinical-interests">
          {props.clinical_specialties.map(interest => (
            <span key={interest} className="clinical interest">
              {" "}
              {interest.replace(/ /g, "\u00a0")}{" "}
            </span>
          ))}
        </p>
        <p>
          {props.additional_interests.map(interest => (
            <span key={interest} className="additional interest">
              {" "}
              {interest}{" "}
            </span>
          ))}
        </p>
      </div>
      <div className="profile-result-right">
        <p>{capitalize(props.cadence)}</p>
        <input disabled title="Shadowing" type="checkbox" checked={props.willing_shadowing}/>
        <input disabled title="Networking" type="checkbox" checked={props.willing_networking}/>
        <input disabled title="Goal setting" type="checkbox" checked={props.willing_goal_setting}/>
        <input disabled title="Personal life" type="checkbox" checked={props.willing_discuss_personal}/>
        <input disabled title="Residency application" type="checkbox" checked={props.willing_residency_application}/>
      </div>
    </Link>
  )
}
