// @flow
import React, { Component } from 'react'
import { Link, type RouterHistory } from 'react-router-dom'
import AvatarEditor from '@razzi/react-avatar-editor'
import Select from 'react-select'
import { type ValueType } from 'react-select/src/types'
import Dropzone from 'react-dropzone'
import Promise from 'promise-polyfill'

import CreatableInputOnly from './CreatableInputOnly'
import CreatableTagSelect from './CreatableTagSelect'
import PreviewProfile from './PreviewProfile'
import CadenceOption from './CadenceOption'

import { uploadPicture, type Profile } from './api'
import {
  clinicalSpecialtyOptions,
  professionalInterestOptions,
  activitiesIEnjoyOptions,
  hospitalOptions,
  degreeOptions,
} from './options'
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

function displayError({ name, email }: { name: string, email: string }) {
  let missing
  if (name === '' && email === '') {
    missing = 'name and email'
  } else if (name === '') {
    missing = 'name'
  } else if (email === '') {
    missing = 'email'
  } else {
    return null
  }
  return <p>Before previewing profile, please enter your {missing}.</p>
}

type Props = {
  loadInitial?: any => void,
  // TODO profileId is passed in updateProfile but not in createProfile. Can't seem to get types to support this without `any`
  saveProfile: (token: string, profile: Profile, profileId: any) => Object,
  token: string,
  profileId?: string,
  setProfileId: ?Function,
  history: RouterHistory,
  firstTimePublish: boolean,
}

type State = {
  position: { x: number, y: number },
  scale: number,
  rotate: number,
  width: number,
  height: number,
  name: string,
  contactEmail: string,
  image: ?File,
  imageUrl: ?string,
  imageSuccess: boolean,
  uploadingImage: boolean,
  imageEdited: boolean,

  affiliations: Array<string>,
  clinicalSpecialties: Array<string>,
  professionalInterests: Array<string>,
  partsOfMe: Array<string>,
  activities: Array<string>,
  degrees: Array<string>,

  additionalInformation: string,

  willingShadowing: boolean,
  willingNetworking: boolean,
  willingGoalSetting: boolean,
  willingDiscussPersonal: boolean,
  willingCareerGuidance: boolean,
  willingStudentGroup: boolean,

  cadence: string,
  otherCadence: string,
  preview: boolean,
}

export default class ProfileForm extends Component<Props, State> {
  otherCadenceInput: ?HTMLInputElement = null

  editor: any = null

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
    degrees: [],

    additionalInformation: '',

    willingShadowing: false,
    willingNetworking: false,
    willingGoalSetting: false,
    willingDiscussPersonal: false,
    willingCareerGuidance: false,
    willingStudentGroup: false,

    cadence: 'monthly',
    otherCadence: '',
    preview: false,
  }

  async componentDidMount() {
    const { loadInitial } = this.props
    if (loadInitial) {
      const data = await loadInitial()
      this.setState(data)
    }
  }

  handleCreate = (key: string) => (selected: string) => {
    const { [key]: current } = this.state

    if (current.includes(selected)) {
      return
    }

    this.setState({
      [key]: [...current, selected],
    })
  }

  handleChange = (key: string) => (selected: ValueType) => {
    if (selected == null) {
      this.setState({ [key]: [] })
      return
    }
    const values = selected.map(({ value }) => value)
    this.setState({ [key]: values })
  }

  update = (field: string) => ({ target }: { target: HTMLInputElement }) => {
    this.setState({ [field]: target.value })
  }

  updateBoolean = (field: string) => ({
    target,
  }: {
    target: HTMLInputElement,
  }) => {
    this.setState({ [field]: target.checked })
  }

  submit = async () => {
    const { saveProfile, token, profileId, setProfileId, history } = this.props
    const { cadence } = this.state

    await when(
      cadence !== 'other',
      () =>
        new Promise(resolve => {
          this.setState(
            {
              otherCadence: '',
            },
            resolve
          )
        })
    )

    const profile = await saveProfile(token, this.state, profileId)

    if (setProfileId) {
      setProfileId(profile.id)
    }

    history.push(`/profiles/${profile.id}`)
  }

  handleDrop = (acceptedFiles: any) => {
    this.setState({ image: acceptedFiles[0], imageEdited: true })
  }

  handleNewImage = (e: { target: { files: Array<File> } }) => {
    this.setState({ image: e.target.files[0], imageEdited: true })
  }

  handleScale = (e: { target: { value: string } }) => {
    const scale = parseFloat(e.target.value)
    this.setState({ scale, imageEdited: true })
  }

  saveImage = () => {
    const { token } = this.props

    this.setState({ uploadingImage: true })

    const canvas = this.editor.getImage()

    const scaled = scaleCanvas(canvas)

    return new Promise(resolve => {
      scaled.toBlob(
        (async blob => {
          const response = await uploadPicture(token, blob)

          this.setState(
            {
              imageUrl: response.image_url,
              imageSuccess: true,
              uploadingImage: false,
              imageEdited: false,
            },
            () => resolve(response)
          )
        }: any)
      ) // The callback returns a Promise but toBlob expects it to return undefined
    })
  }

  setEditorRef = (editor: HTMLElement | null) => {
    this.editor = editor
  }

  rotateRight = () => {
    const { rotate } = this.state
    const rotation = (90 + rotate) % 360
    this.setState({ rotate: rotation, imageEdited: true })
  }

  setPreview = () => {
    this.setState({ preview: true })
  }

  unsetPreview = () => {
    this.setState({ preview: false })
  }

  removeProfileImage = () => {
    this.setState({ imageUrl: null, image: null }, () =>
      this.editor.clearImage()
    )
  }

  render() {
    const {
      activities,
      affiliations,
      cadence,
      clinicalSpecialties,
      contactEmail,
      degrees,
      image,
      imageUrl,
      name,
      otherCadence,
      partsOfMe,
      preview,
      professionalInterests,
      rotate,
      scale,
      willingCareerGuidance,
      willingDiscussPersonal,
      willingGoalSetting,
      willingNetworking,
      willingShadowing,
      willingStudentGroup,
      additionalInformation,
      uploadingImage,
      imageSuccess,
      imageEdited,
    } = this.state

    const { firstTimePublish } = this.props

    if (preview) {
      return (
        <PreviewProfile
          data={{
            activities,
            affiliations,
            cadence,
            clinicalSpecialties,
            contactEmail,
            degrees,
            imageUrl,
            name,
            otherCadence,
            partsOfMe,
            professionalInterests,
            willingCareerGuidance,
            willingDiscussPersonal,
            willingGoalSetting,
            willingNetworking,
            willingShadowing,
            willingStudentGroup,
            additionalInformation,
          }}
          firstTimePublish={firstTimePublish}
          onEdit={this.unsetPreview}
          onPublish={this.submit}
        />
      )
    }

    const hasImage = imageUrl || image

    return (
      <div>
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
                image={image || imageUrl}
                crossOrigin="anonymous"
                scale={parseFloat(scale)}
                width={180}
                height={180}
                rotate={rotate}
              />
            </Dropzone>
            <div>
              <input
                id="image-upload"
                name="newImage"
                type="file"
                accept="image/*"
                onChange={this.handleNewImage}
              />
              <input
                name="scale"
                type="range"
                onChange={this.handleScale}
                min="1"
                max="2"
                step="0.01"
                disabled={!hasImage}
                defaultValue="1"
              />
              <button
                type="button"
                disabled={!hasImage}
                onClick={this.rotateRight}
              >
                Rotate
              </button>
              {hasImage && (
                <button type="button" onClick={this.removeProfileImage}>
                  Remove image
                </button>
              )}
            </div>

            <div className="expectations">
              <h3>I am available to mentor in the following ways:</h3>

              <div className="expectation">
                <label htmlFor="willing-shadowing">
                  <input
                    id="willing-shadowing"
                    type="checkbox"
                    checked={willingShadowing}
                    onChange={this.updateBoolean('willingShadowing')}
                  />
                  Clinical shadowing opportunities
                </label>
              </div>

              <div className="expectation">
                <label htmlFor="willing-networking">
                  <input
                    id="willing-networking"
                    type="checkbox"
                    checked={willingNetworking}
                    onChange={this.updateBoolean('willingNetworking')}
                  />
                  Networking
                </label>
              </div>

              <div className="expectation">
                <label htmlFor="willing-goal-setting">
                  <input
                    id="willing-goal-setting"
                    type="checkbox"
                    checked={willingGoalSetting}
                    onChange={this.updateBoolean('willingGoalSetting')}
                  />
                  Goal setting
                </label>
              </div>

              <div className="expectation">
                <label htmlFor="willing-discuss-personal">
                  <input
                    id="willing-discuss-personal"
                    type="checkbox"
                    checked={willingDiscussPersonal}
                    onChange={this.updateBoolean('willingDiscussPersonal')}
                  />
                  Discussing personal as well as professional life
                </label>
              </div>

              <div className="expectation">
                <label htmlFor="willing-career-guidance">
                  <input
                    id="willing-career-guidance"
                    type="checkbox"
                    checked={willingCareerGuidance}
                    onChange={this.updateBoolean('willingCareerGuidance')}
                  />
                  Career guidance
                </label>
              </div>

              <div className="expectation">
                <label htmlFor="willing-student-group">
                  <input
                    id="willing-student-group"
                    type="checkbox"
                    checked={willingStudentGroup}
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
              value={name}
              onChange={this.update('name')}
            />
            <p>Preferred Contact Email</p>
            <input
              name="email"
              type="email"
              className="fullWidth"
              value={contactEmail}
              onChange={this.update('contactEmail')}
            />
            <p>Academic Degrees</p>
            <CreatableTagSelect
              values={degrees}
              options={degreeOptions}
              handleChange={this.handleChange('degrees')}
              handleAdd={this.handleCreate('degrees')}
            />
            <p>Institutional Affiliations</p>
            <Select
              styles={{
                control: base => ({ ...base, backgroundColor: 'white' }),
                multiValue: styles => ({
                  ...styles,
                  backgroundColor: '#edf4fe',
                }),
              }}
              className="column"
              isMulti
              options={hospitalOptions}
              value={affiliations.map(value => ({
                label: value,
                value,
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
              values={clinicalSpecialties}
              options={clinicalSpecialtyOptions}
              handleChange={this.handleChange('clinicalSpecialties')}
              handleAdd={this.handleCreate('clinicalSpecialties')}
            />
            <p>Professional Interests</p>
            <CreatableTagSelect
              values={professionalInterests}
              options={professionalInterestOptions}
              handleChange={this.handleChange('professionalInterests')}
              handleAdd={this.handleCreate('professionalInterests')}
            />
            <div className="user-tip">
              <p>
                Please use this section to share parts of your identity. This is
                where faculty may share optional demographic or personally
                meaningful information that is viewable by students and faculty
                on Weave. Please{' '}
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
                values={partsOfMe}
                handleAdd={this.handleCreate('partsOfMe')}
                handleChange={this.handleChange('partsOfMe')}
              />
            </div>
            <div data-tip="Please feel free to create your own tags with activities that you enjoy.">
              <p>Activities I Enjoy</p>
              <CreatableTagSelect
                values={activities}
                options={activitiesIEnjoyOptions}
                handleChange={this.handleChange('activities')}
                handleAdd={this.handleCreate('activities')}
              />
            </div>
            <p>What else would you like to share with potential mentees?</p>
            <textarea
              onChange={this.update('additionalInformation')}
              value={additionalInformation}
              maxLength={500}
              style={{
                width: '100%',
                height: '3em',
                fontSize: '18px',
                border: '1px solid lightgray',
              }}
            />
          </div>
        </div>
        <div>
          <div className="cadence">
            <h3>Meeting Cadence</h3>
            <CadenceOption
              value="biweekly"
              selectedCadence={cadence}
              onChange={this.update('cadence')}
            />

            <CadenceOption
              value="monthly"
              selectedCadence={cadence}
              onChange={this.update('cadence')}
            />

            <CadenceOption
              value="2-3 conversations/year"
              selectedCadence={cadence}
              onChange={this.update('cadence')}
            />

            <label htmlFor="other-cadence">
              <input
                id="other-cadence"
                onChange={this.update('cadence')}
                name="cadence"
                checked={cadence === 'other'}
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
                value={otherCadence}
                onFocus={() => {
                  this.setState({ cadence: 'other' })
                  if (this.otherCadenceInput) {
                    this.otherCadenceInput.checked = true
                  }
                }}
                onChange={this.update('otherCadence')}
              />
            </label>
          </div>

          <button
            type="submit"
            className="button"
            disabled={uploadingImage || name === '' || contactEmail === ''}
            onClick={async () => {
              const unsavedImage =
                imageEdited || (!imageSuccess && image !== null)

              await when(unsavedImage, this.saveImage)

              this.setPreview()
            }}
          >
            {uploadingImage ? 'Loading preview...' : 'Preview profile'}
          </button>
          {displayError({
            name,
            email: contactEmail,
          })}
        </div>
      </div>
    )
  }
}
