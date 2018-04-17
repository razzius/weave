import React, { Component } from 'react'
import Select from 'react-select'
import tags from './tags'
import hospitals from './hospitals'
import 'react-select/dist/react-select.css'

const interestOptions = tags.map(tag => ({
  label: tag, value: tag
}))

const hospitalOptions = hospitals.map(hospital => ({
  label: hospital, value: hospital
}))

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
          <button>Save changes</button>
        </div>
      </div>
    )
  }
}
