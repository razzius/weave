import React, { Component } from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { createProfile } from './api'
import { interestOptions, hospitalOptions } from './options'

function placehold(size) {
  return `//placehold.it/${size}`
}

export default class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      interests: [],
      affiliations: []
    }
  }

  handleSelectInterests(interests) {
    this.setState({interests})
  }

  handleSelectHospitalAffiliations(affiliations) {
    this.setState({affiliations})
  }

  submit() {
    createProfile(this.state)
  }

  render() {
    return (
      <div className="profile-contact">
        <div className="columns">
          <div className="column contact">
            <img className="profile-image column" src={placehold(150)}/>
            <input type="file" name="pic" accept="image/*"/>
            <p>
              <p>Preferred contact email</p>
              <input type="email"/>
            </p>
          </div>
          <div className="about" style={{width: '350px'}}>
            <p>Interests</p>
            <Select
              className="column"
              multi
              options={interestOptions}
              value={this.state.interests}
              onChange={this.handleSelectInterests.bind(this)} />
            <p>Hospital Affiliations</p>
            <Select
              className="column"
              multi
              options={hospitalOptions}
              value={this.state.affiliations}
              onChange={this.handleSelectHospitalAffiliations.bind(this)} />
            <p>Clinical</p>
            <p>Non-clinical</p>
          </div>
          <img src={placehold(150)}/>
        </div>
        <div>
          <h2>Expectations</h2>
          <h2>Cadence</h2>
          <button onClick={this.submit}>Save changes</button>
        </div>
      </div>
    )
  }
}
