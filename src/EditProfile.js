import React, { Component } from 'react'
import AvatarEditor from 'react-avatar-editor'
import Select from 'react-select'
import Dropzone from 'react-dropzone'
import 'react-select/dist/react-select.css'

import ProfileView from './ProfileView'

import { createProfile, uploadPicture, profileToPayload } from './api'
import {
  clinicalSpecialtyOptions,
  additionalInterestOptions,
  hospitalOptions
} from './options'
import AppScreen from './AppScreen'

function scaleCanvas(canvas) {
  const scaled = document.createElement('canvas')
  const size = 200
  scaled.width = size
  scaled.height = size
  const context = scaled.getContext('2d')
  context.drawImage(canvas, 0, 0, size, size)
  return scaled
}

export default class EditProfile extends Component {
  state = {
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    width: 200,
    height: 200,
    name: '',
    email: '',
    image: null,
    imageUrl: null,
    imageSuccess: false,
    uploadingImage: false,
    affiliations: [],
    clinicalSpecialties: [],
    additionalInterests: [],
    additionalInformation: '',

    willingShadowing: false,
    willingNetworking: false,
    willingGoalSetting: false,
    willingDiscussPersonal: false,
    willingResidencyApplication: false,

    cadence: 'monthly',
    otherCadence: null,
    preview: false
  }

  handleSelectClinicalSpecialties = specialties => {
    this.setState({
      clinicalSpecialties: specialties.map(specialty => specialty.value)
    })
  }

  handleSelectAffiliations = affiliations => {
    this.setState({
      affiliations: affiliations.map(affiliation => affiliation.value)
    })
  }

  handleSelectAdditionalInterests = interests => {
    this.setState({
      additionalInterests: interests.map(interest => interest.value)
    })
  }

  update = field => ({ target }) => {
    this.setState({ [field]: target.value })
  }

  updateBoolean = field => ({ target }) => {
    this.setState({ [field]: target.value === "on" })
  }

  submit = () => {
    let promise

    if (!this.state.imageSuccess && this.state.image !== null) {
      promise = this.saveImage()
    } else {
      promise = Promise.resolve(true)
    }

    return promise.then(() => {
      createProfile(this.state)
        .then(profile => {
          this.props.authenticate(1)  // TODO proper server-given token
          this.props.history.push(`/profiles/${profile.id}`)
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handleDrop = acceptedFiles => {
    this.setState({ image: acceptedFiles[0] })
  }

  handleNewImage = e => {
    this.setState({ image: e.target.files[0] })
  }

  handleScale = e => {
    const scale = parseFloat(e.target.value)
    this.setState({ scale })
  }

  saveImage = () => {
    this.setState({ uploadingImage: true })

    const canvas = this.editor.getImage()

    const scaled = scaleCanvas(canvas)

    return new Promise(resolve => {
      scaled.toBlob(blob =>
        uploadPicture(blob).then(response => {
          this.setState({
            imageUrl: response.image_url,
            imageSuccess: true,
            uploadingImage: false
          })
          resolve(response)
        })
      )
    })
  }

  setEditorRef = editor => {
    this.editor = editor
  }

  rotateRight = () => {
    const rotation = (90 + this.state.rotate) % 360
    this.setState({ rotate: rotation })
  }

  render() {
    if (this.state.preview) {
      return (
        <div>
          <ProfileView data={profileToPayload(this.state)} />
          <div style={{width: '700px', margin: 'auto'}}>
            <button style={{marginRight: '1em'}} className="button"
              onClick={() => {
                this.setState({ preview: false })
              }}
            >
              Edit
            </button>
            <button className="button" onClick={this.submit}>Publish profile</button>
          </div>
        </div>
      )
    }

    return (
      <AppScreen className="edit-profile">
        <div className="columns">
          <div className="column contact">
            <Dropzone
              onDrop={this.handleDrop}
              disableClick
              multiple={false}
              style={{ width: '200px', height: '200px', marginBottom: '55px' }}
            >
              <AvatarEditor
                ref={this.setEditorRef}
                borderRadius={100}
                image={this.state.image}
                scale={parseFloat(this.state.scale)}
                width={180}
                height={180}
                rotate={this.state.rotate}
              />
            </Dropzone>
            <div>
              <input
                name="newImage"
                type="file"
                onChange={this.handleNewImage}
              />
              <input
                name="scale"
                type="range"
                onChange={this.handleScale}
                min={this.state.allowZoomOut ? '0.1' : '1'}
                max="2"
                step="0.01"
                defaultValue="1"
              />
              <button onClick={this.rotateRight}>Rotate</button>
              <input
                value={
                  this.state.uploadingImage ? 'Uploading...' : 'Save image'
                }
                disabled={!this.state.image}
                type="submit"
                onClick={this.saveImage}
              />
              {this.state.imageSuccess ? 'Image uploaded' : null}
            </div>

          </div>

          <div
            className="about"
            style={{ width: '450px', paddingLeft: '50px' }}
          >
            <p>Name</p>
            <input
              type="text"
              name="name"
              className="fullWidth"
              onChange={this.update('name')}
            />

            <p>Preferred contact email</p>
            <input
              name="email"
              type="email"
              className="fullWidth"
              onChange={this.update('email')}
            />

            <p>Hospital Affiliations</p>
            <Select
              className="column"
              multi
              options={hospitalOptions}
              value={this.state.affiliations}
              onChange={this.handleSelectAffiliations}
            />

            <p>Clinical Interests</p>
            <Select
              className="column"
              multi
              options={clinicalSpecialtyOptions}
              value={this.state.clinicalSpecialties}
              onChange={this.handleSelectClinicalSpecialties}
            />

            <p>Additional Interests</p>
            <Select
              className="column"
              multi
              options={additionalInterestOptions}
              value={this.state.additionalInterests}
              onChange={this.handleSelectAdditionalInterests}
            />

            <p>Additional Information</p>
            <textarea
              onChange={this.update('additionalInformation')}
              maxLength={500}
              style={{
                width: '100%',
                height: '3em',
                fontSize: '18px'
              }}
            />
          </div>
        </div>
        <div>
          <div className="expectations">
            <h3>Optional expectations</h3>

            <div className="expectation">
              <label>
                <input
                  type="checkbox"
                  checked={this.state.willingShadowing}
                  onChange={this.updateBoolean('willingShadowing')}
                />
                Will allow shadowing opportunities for mentee(s).
              </label>
            </div>

            <div className="expectation">
              <label>
                <input
                  type="checkbox"
                  checked={this.state.willingNetworking}
                  onChange={this.updateBoolean('willingNetworking')}
                />
                Will help mentee(s) with networking as deemed appropriate.
              </label>
            </div>

            <div className="expectation">
              <label>
                <input
                  type="checkbox"
                  checked={this.state.willingGoalSetting}
                  onChange={this.updateBoolean('willingGoalSetting')}
                />
                Will help mentee(s) with goal setting.
              </label>
            </div>

            <div className="expectation">
              <label>
                <input
                  type="checkbox"
                  checked={this.state.willingDiscussPersonal}
                  onChange={this.updateBoolean('willingDiscussPersonal')}
                />
                Willing to discuss personal as well as professional life.
              </label>
            </div>

            <div className="expectation">
              <label>
                <input
                  type="checkbox"
                  checked={this.state.willingResidencyApplication}
                  onChange={this.updateBoolean('willingResidencyApplication')}
                />
                Willing to advise for residency application.
              </label>
            </div>
          </div>
          <div className="cadence">
            <h3>Cadence</h3>
            <label>
              <input
                onChange={this.update('cadence')}
                name="cadence"
                type="radio"
                value="biweekly"
              />
              Every 2 weeks
            </label>

            <label>
              <input
                defaultChecked
                onChange={this.update('cadence')}
                name="cadence"
                type="radio"
                value="monthly"
              />
              Monthly
            </label>

            <label>
              <input
                onChange={this.update('cadence')}
                name="cadence"
                type="radio"
                value="quarterly"
              />
              Quarterly
            </label>

            <label>
              <input
                onChange={this.update('cadence')}
                name="cadence"
                type="radio"
                value="other"
                ref={el => {
                  this.otherCadenceInput = el
                }}
              />
              Other
              <input
                type="text"
                onFocus={() => {
                  this.setState({ cadence: 'other' })
                  this.otherCadenceInput.checked = true
                }}
                onChange={this.update('otherCadence')}
              />
            </label>
          </div>

          <button
            className="button"
            onClick={() => {
              if (this.state.image !== null && this.state.imageUrl === null) {
                this.saveImage().then(() => {
                  this.setState({ preview: true })
                })
              } else {
                this.setState({ preview: true })
              }
            }}
          >
            Preview profile
          </button>
        </div>
      </AppScreen>
    )
  }
}
