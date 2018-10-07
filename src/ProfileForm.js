import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AvatarEditor from 'react-avatar-editor'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import Dropzone from 'react-dropzone'

import ProfileView from './ProfileView'
import CreatableInputOnly from './CreatableInputOnly'

import { uploadPicture, profileToPayload } from './api'
import {
  clinicalSpecialtyOptions,
  professionalInterestOptions,
  activitiesIEnjoyOptions,
  hospitalOptions
} from './options'
import AppScreen from './AppScreen'
import { when } from './utils'

function scaleCanvas(canvas) {
  const scaled = document.createElement('canvas')
  const size = 200
  scaled.width = size
  scaled.height = size
  const context = scaled.getContext('2d')
  context.drawImage(canvas, 0, 0, size, size)
  return scaled
}

class CreatableTagSelect extends Component {
  state = {
    inputValue: ''
  }

  handleInputChange = inputValue => {
    this.setState({ inputValue: inputValue.slice(0, 50) })
  }

  render() {
    const { options, handleSelect, values } = this.props
    return (
      <CreatableSelect
        styles={{
          control: base => ({ ...base, backgroundColor: 'white' }),
          multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' })
        }}
        inputValue={this.state.inputValue}
        value={values.map(value => ({ label: value, value }))}
        onInputChange={this.handleInputChange}
        className="column"
        isMulti
        options={options}
        onChange={handleSelect}
        placeholder="Select or type something and press enter..."
      />
    )
  }
}

export default class ProfileForm extends Component {
  state = {
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    width: 200,
    height: 200,
    name: '',
    contactEmail: '',
    image: null,
    imageUrl: null,
    imageSuccess: false,
    uploadingImage: false,
    imageEdited: false,

    affiliations: [],
    clinicalSpecialties: [],
    professionalInterests: [],
    partsOfMe: [],
    activities: [],

    partsOfMeOptions: [],

    additionalInformation: '',

    willingShadowing: false,
    willingNetworking: false,
    willingGoalSetting: false,
    willingDiscussPersonal: false,
    willingCareerGuidance: false,
    willingStudentGroup: false,

    cadence: 'monthly',
    otherCadence: null,
    preview: false
  }

  async componentDidMount() {
    if (this.props.loadInitial) {
      const data = await this.props.loadInitial()
      this.setState(data)
    }
  }

  handleCreate = key => selected => {
    const current = this.state[key]

    this.setState({
      [key]: [...current, selected]
    })
  }

  handleChange = key => values => {
    this.setState({ [key]: values.map(({ value }) => value) })
  }

  handleSelect = key => options => {
    const values = options.map(({ value }) => value)
    this.setState({ [key]: values })
  }

  update = field => ({ target }) => {
    this.setState({ [field]: target.value })
  }

  updateBoolean = field => ({ target }) => {
    this.setState({ [field]: target.checked })
  }

  submit = async () => {
    const profile = await this.props.saveProfile(
      this.props.token,
      this.state,
      this.props.profileId
    )

    if (!this.props.profileId) {
      this.props.setAvailableForMentoring()
    }
    this.props.setProfileId(profile.id)
    this.props.history.push(`/profiles/${profile.id}`)
  }

  handleDrop = acceptedFiles => {
    this.setState({ image: acceptedFiles[0], imageEdited: true })
  }

  handleNewImage = e => {
    this.setState({ image: e.target.files[0], imageEdited: true })
  }

  handleScale = e => {
    const scale = parseFloat(e.target.value)
    this.setState({ scale, imageEdited: true })
  }

  saveImage = () => {
    const { token } = this.props

    this.setState({ uploadingImage: true })

    const canvas = this.editor.getImage()

    const scaled = scaleCanvas(canvas)

    return new Promise(resolve => {
      scaled.toBlob(async blob => {
        const response = await uploadPicture(token, blob)

        this.setState(
          {
            imageUrl: response.image_url,
            imageSuccess: true,
            uploadingImage: false,
            imageEdited: false
          },
          () => resolve(response)
        )
      })
    })
  }

  setEditorRef = editor => {
    this.editor = editor
  }

  rotateRight = () => {
    const rotation = (90 + this.state.rotate) % 360
    this.setState({ rotate: rotation, imageEdited: true })
  }

  setPreview = () => {
    this.setState({ preview: true })
  }

  unsetPreview = () => {
    this.setState({ preview: false })
  }

  render() {
    const { firstTimePublish } = this.props

    if (this.state.preview) {
      return (
        <div>
          <ProfileView
            data={profileToPayload(this.state)}
            editing
            firstTimePublish={firstTimePublish}
          />
          <div style={{ width: '850px', margin: 'auto' }}>
            <button className="button" onClick={this.unsetPreview}>
              Edit
            </button>
            <button className="button" onClick={this.submit}>
              {firstTimePublish ? 'Publish' : 'Save'} profile
            </button>
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
                image={this.state.image || this.state.imageUrl}
                crossOrigin="anonymous"
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
                accept="image/*"
                onChange={this.handleNewImage}
              />
              <input
                name="scale"
                type="range"
                onChange={this.handleScale}
                min={this.state.allowZoomOut ? '0.1' : '1'}
                max="2"
                step="0.01"
                disabled={!this.state.image}
                defaultValue="1"
              />
              <button onClick={this.rotateRight}>Rotate</button>
            </div>

            <div className="expectations">
              <h3>I am available to mentor in the following ways:</h3>

              <div className="expectation">
                <label>
                  <input
                    type="checkbox"
                    checked={this.state.willingShadowing}
                    onChange={this.updateBoolean('willingShadowing')}
                  />
                  Clinical shadowing opportunities
                </label>
              </div>

              <div className="expectation">
                <label>
                  <input
                    type="checkbox"
                    checked={this.state.willingNetworking}
                    onChange={this.updateBoolean('willingNetworking')}
                  />
                  Networking
                </label>
              </div>

              <div className="expectation">
                <label>
                  <input
                    type="checkbox"
                    checked={this.state.willingGoalSetting}
                    onChange={this.updateBoolean('willingGoalSetting')}
                  />
                  Goal setting
                </label>
              </div>

              <div className="expectation">
                <label>
                  <input
                    type="checkbox"
                    checked={this.state.willingDiscussPersonal}
                    onChange={this.updateBoolean('willingDiscussPersonal')}
                  />
                  Discussing personal as well as professional life
                </label>
              </div>

              <div className="expectation">
                <label>
                  <input
                    type="checkbox"
                    checked={this.state.willingCareerGuidance}
                    onChange={this.updateBoolean('willingCareerGuidance')}
                  />
                  Career guidance
                </label>
              </div>

              <div className="expectation">
                <label>
                  <input
                    type="checkbox"
                    checked={this.state.willingStudentGroup}
                    onChange={this.updateBoolean('willingStudentGroup')}
                  />
                  Student interest group support or speaking at student events
                </label>
              </div>
            </div>
          </div>

          <div className="about">
            <p>Name</p>
            <input
              type="text"
              name="name"
              autoComplete="off"
              className="fullWidth"
              value={this.state.name}
              onChange={this.update('name')}
            />

            <p>Preferred Contact Email</p>
            <input
              name="email"
              type="email"
              className="fullWidth"
              value={this.state.contactEmail}
              onChange={this.update('contactEmail')}
            />

            <p>Hospital Affiliations</p>
            <Select
              styles={{
                control: base => ({ ...base, backgroundColor: 'white' }),
                multiValue: styles => ({
                  ...styles,
                  backgroundColor: '#edf4fe'
                })
              }}
              className="column"
              isMulti
              options={hospitalOptions}
              value={this.state.affiliations.map(value => ({
                label: value,
                value
              }))}
              onChange={this.handleChange('affiliations')}
            />

            <div className="user-tip">
              In the following sections, in addition to choosing from the tags
              below, you may also create your own tags by typing them in and
              pressing enter. You may create as many tags as you would like.
            </div>

            <p>Clinical Interests</p>
            <CreatableTagSelect
              values={this.state.clinicalSpecialties}
              options={clinicalSpecialtyOptions}
              handleSelect={this.handleSelect('clinicalSpecialties')}
            />

            <p>Professional Interests</p>
            <CreatableTagSelect
              values={this.state.professionalInterests}
              options={professionalInterestOptions}
              handleSelect={this.handleSelect('professionalInterests')}
            />

            <div className="user-tip">
              <p>
                Please use this section to share parts of your identity. This is
                where faculty may share optional demographic or personally
                meaningful information that is viewable by HMS students and
                faculty on Weave. Please{' '}
                <Link to="/help" target="_blank">
                  create your own tags
                </Link>{' '}
                in this section. You may create as many “Parts of me” tags as
                you would like.
              </p>
              <p>
                Example tags: American Samoan, Mother, First generation, New
                Englander, Christian, Latino, LGBTQ+
              </p>
            </div>
            <div data-tip="Please feel free to create your own tags with identities or locations that are important to you.">
              <p>Parts Of Me</p>
              <CreatableInputOnly
                value={this.state.partsOfMe.map(value => ({
                  label: value,
                  value
                }))}
                handleChange={this.handleCreate('partsOfMe')}
                handleSet={this.handleChange('partsOfMe')}
              />
            </div>

            <div data-tip="Please feel free to create your own tags with activities that you enjoy.">
              <p>Activities I Enjoy</p>
              <CreatableTagSelect
                values={this.state.activities}
                options={activitiesIEnjoyOptions}
                handleSelect={this.handleSelect('activities')}
              />
            </div>

            <p>What else would you like to share with potential mentees?</p>
            <textarea
              onChange={this.update('additionalInformation')}
              value={this.state.additionalInformation}
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
          <div className="cadence">
            <h3>Meeting Cadence</h3>
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
                value="2-3 conversations/year"
              />
              2-3 conversations/year
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
                style={{ marginLeft: '4px' }}
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
            disabled={this.state.uploadingImage}
            onClick={async () => {
              const unsavedImage =
                this.state.imageEdited ||
                (!this.state.imageSuccess && this.state.image !== null)

              await when(unsavedImage, this.saveImage)

              this.setPreview()
            }}
          >
            {this.state.uploadingImage
              ? 'Loading preview...'
              : 'Preview profile'}
          </button>
        </div>
      </AppScreen>
    )
  }
}
