import React from 'react'
import { Link } from 'react-router-dom'

export default (props) => {
  return <Link to={`/profiles/${props.id}`} className="profile-result" params={{test: "tricky"}}>
    <img alt="Profile"className="profile-image" src="//placehold.it/150"/>
    <div>
      <h2>{props.name}</h2>
      <p>{props.clinical_interests.map(
        interest => <span key={interest} className="clinical interest"> {interest} </span>
      )}</p>
      <p>{props.additional_interests.map(
        interest => <span key={interest} className="additional interest"> {interest} </span>
      )}</p>
    </div>
    <div className="profile-result-right">
      <p>Level of involvement: </p>
      <p>Meeting frequency: </p>
    </div>
  </Link>
}
