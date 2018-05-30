import React, { Component } from "react"
import { getProfile } from "./api"
import AppScreen from "./AppScreen"

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null
    }
    getProfile(props.match.params.id).then(data => this.setState({ data }))
  }

  render() {
    const { data } = this.state
    return (
      this.state.data !== null && (
        <AppScreen>
          <div className="profile-contact">
            <div className="columns">
              <div className="column contact">
                <img
                  alt="Profile"
                  className="profile-image column"
                  src={data.profile_image_url}
                />
              </div>
              <div className="about" style={{ width: "450px" }}>
                <h1>{data.name}</h1>
                <a href={`mailto:${data.email}`}>{data.email}</a>
                <p>Affiliations: {data.affiliations.join(", ")}</p>
                <p>
                  Clinical specialties: {data.clinical_specialties.join(", ")}
                </p>
                <p>
                  Additional interests: {data.additional_interests.join(", ")}
                </p>
                {data.additional_information && (
                  <div>
                    <p>Additional Information:</p>
                    <p>{data.additional_information}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2>Expectations</h2>
              <p>TODO</p>
              <h2>Cadence</h2>
              <p>TODO</p>
            </div>
          </div>
        </AppScreen>
      )
    )
  }
}
