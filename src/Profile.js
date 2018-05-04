import React, { Component } from "react"
import profiles from "./profiles"
import { getProfile } from "./api"

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null
    }
    getProfile(props.match.params.id).then(data => this.setState({ data }))
  }

  render() {
    return (
      this.state.data !== null && (
        <div className="profile-contact">
          <div className="columns">
            <div className="column contact">
              <img
                className="profile-image column"
                src="http://placehold.it/150"
              />
              <p>{this.state.data.name}</p>
            </div>
            <div className="about" style={{ width: "450px" }}>
              <p>Interests</p>
              <p>Hospital Affiliations</p>
              <p>Clinical</p>
              <p>Non-clinical</p>
            </div>
          </div>
          <div>
            <h2>Expectations</h2>
            <h2>Cadence</h2>
          </div>
        </div>
      )
    )
  }
}
