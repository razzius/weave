import React from "react"
import { Link } from "react-router-dom"

export default props => {
  return (
    <Link
      to={`/profiles/${props.id}`}
      className="profile-result"
      params={{ test: "tricky" }}
    >
      <img alt="Profile" className="profile-image" src={props.profile_image_url} />
      <div>
        <h2>{props.name}</h2>
        <p>
          {props.affiliations.map(affiliation => (
            <span key={affiliation} className="affiliation">
              {" "}
              {affiliation}{" "}
            </span>
          ))}
        </p>
        <p>
          {props.clinical_specialties.map(interest => (
            <span key={interest} className="clinical interest">
              {" "}
              {interest}{" "}
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
        <p>Meeting cadence: {props.cadence}</p>
      </div>
    </Link>
  )
}
