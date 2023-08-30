import React, { Component } from 'react'
import { Link, Prompt } from 'react-router-dom'
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import Promise from 'promise-polyfill'

import CreatableInputOnly from './CreatableInputOnly'
import CreatableTagSelect from './CreatableTagSelect'
import PreviewProfile from './PreviewProfile'
import CadenceOption from './CadenceOption'

import { getProfileTags, uploadPicture } from './api'
import { makeOptions } from './options'
import { arrayCaseInsensitiveContains, capitalize, last, when } from './utils'

function scaleCanvas(canvas) {
  const scaled = document.createElement('canvas')
  const size = 200
  scaled.width = size
  scaled.height = size
  const context = scaled.getContext('2d')
  context.drawImage(canvas, 0, 0, size, size)
  return scaled
}

function displayError({ name, email }) {
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

export default class ProfileForm extends Component {
  otherCadenceInput = null

  editor = null

  state = {
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

    // TODO these fields are the superset of all student and faculty possible fields.
    // Theoretically only the relevant fields for each role could be in state.
    program: null,
    pceSite: null,
    currentYear: null,

    degrees: [],

    additionalInformation: '',

    // Shared checkboxes
    willingDiscussPersonal: false,
    willingStudentGroup: false,

    // Faculty
    willingShadowing: false,
    willingNetworking: false,
    willingGoalSetting: false,
    willingCareerGuidance: false,

    // Student
    willingDualDegrees: false,
    willingAdviceClinicalRotations: false,
    willingResearch: false,
    willingResidency: false,

    cadence: 'monthly',
    otherCadence: '',
    preview: false,
    saved: false,

    hospitalOptions: [],
    clinicalSpecialtyOptions: [],
    activitiesIEnjoyOptions: [],
    professionalInterestOptions: [],
    programOptions: [],
    currentYearOptions: [],
    pceSiteOptions: [],
  }

  async componentDidMount() {
    const { loadInitial } = this.props

    const initialData = loadInitial ? await loadInitial() : {}

    const { tags } = await getProfileTags()

    this.setState({
      ...initialData,
      programOptions: tags.programs,
      pceSiteOptions: tags.pce_site_options,
      currentYearOptions: tags.current_year_options,
      hospitalOptions: tags.hospital_affiliations,
      clinicalSpecialtyOptions: tags.clinical_specialties,
      professionalInterestOptions: tags.professional_interests,
      activitiesIEnjoyOptions: tags.activities,
    })
  }

  handleCreate = (key) => (selected) => {
    const { [key]: current } = this.state

    const trimmed = selected.trim()

    if (arrayCaseInsensitiveContains(current, trimmed)) {
      return
    }

    this.setState({
      [key]: [...current, capitalize(trimmed)],
    })
  }

  handleChangeField =
    (key) =>
    ({ value }) => {
      this.setState({ [key]: value })
    }

  handleChange = (key) => (selected, meta) => {
    if (selected == null) {
      this.setState({ [key]: [] })
      return
    }

    const values = selected.map(({ value }) => value)

    if (meta.action === 'create-option') {
      const newValue = last(values).trim()
      const otherValues = values.slice(0, -1)

      if (
        newValue === '' ||
        arrayCaseInsensitiveContains(otherValues, newValue)
      ) {
        return
      }

      const capitalized = capitalize(newValue)

      this.setState({ [key]: [...otherValues, capitalized] })
      return
    }
    this.setState({ [key]: values })
  }

  update =
    (field) =>
    ({ target }) => {
      this.setState({ [field]: target.value })
    }

  updateBoolean =
    (field) =>
    ({ target }) => {
      this.setState({ [field]: target.checked })
    }

  submit = async () => {
    const { saveProfile, profileId, setProfileId, history, profileBaseUrl } =
      this.props
    const { cadence } = this.state

    await when(
      cadence !== 'other',
      () =>
        new Promise((resolve) => {
          this.setState(
            {
              otherCadence: '',
            },
            resolve
          )
        })
    )

    const profile = await saveProfile(this.state, profileId)

    if (setProfileId) {
      setProfileId(profile.id)
    }

    this.setState({ saved: true }, () => {
      history.push(`/${profileBaseUrl}/${profile.id}`)
    })
  }

  handleDrop = (acceptedFiles) => {
    this.setState({ image: acceptedFiles[0], imageEdited: true })
  }

  handleNewImage = (e) => {
    this.setState({ image: e.target.files[0], imageEdited: true })
  }

  handleScale = (e) => {
    const scale = parseFloat(e.target.value)
    this.setState({ scale, imageEdited: true })
  }

  saveImage = () => {
    this.setState({ uploadingImage: true })

    const canvas = this.editor.getImage()

    const scaled = scaleCanvas(canvas)

    return new Promise((resolve) => {
      scaled.toBlob(async (blob) => {
        const response = await uploadPicture(blob)

        this.setState(
          {
            imageUrl: response.image_url,
            imageSuccess: true,
            uploadingImage: false,
            imageEdited: false,
          },
          () => resolve(response)
        )
      }) // The callback returns a Promise but toBlob expects it to return undefined
    })
  }

  setEditorRef = (editor) => {
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

  renderForm() {
    const {
      activities,
      activitiesIEnjoyOptions,
      additionalInformation,
      affiliations,
      cadence,
      clinicalSpecialties,
      clinicalSpecialtyOptions,
      contactEmail,
      currentYear,
      currentYearOptions,
      degrees,
      hospitalOptions,
      image,
      imageEdited,
      imageSuccess,
      imageUrl,
      name,
      otherCadence,
      partsOfMe,
      pceSite,
      pceSiteOptions,
      preview,
      professionalInterestOptions,
      professionalInterests,
      program,
      programOptions,
      rotate,
      scale,
      uploadingImage,
      willingCareerGuidance,
      willingDiscussPersonal,
      willingGoalSetting,
      willingNetworking,
      willingShadowing,
      willingStudentGroup,
      willingDualDegrees,
      willingAdviceClinicalRotations,
      willingResearch,
      willingResidency,
    } = this.state

    const {
      firstTimePublish,
      RoleSpecificFields,
      RoleSpecificProfileView,
      RoleSpecificCheckboxes,
      RoleSpecificExpectations,
      isStudent,
    } = this.props

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
            willingDualDegrees,
            willingAdviceClinicalRotations,
            willingResearch,
            willingResidency,
            additionalInformation,
            program,
            pceSite,
            currentYear,
          }}
          RoleSpecificProfileView={RoleSpecificProfileView}
          RoleSpecificExpectations={RoleSpecificExpectations}
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
              noClick
              multiple={false}
              style={{ width: '200px', height: '200px', marginBottom: '55px' }}
            >
              {() => (
                <section>
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
                </section>
              )}
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

              <RoleSpecificCheckboxes
                updateBoolean={this.updateBoolean}
                willingDiscussPersonal={willingDiscussPersonal}
                willingStudentGroup={willingStudentGroup}
                willingShadowing={willingShadowing}
                willingNetworking={willingNetworking}
                willingGoalSetting={willingGoalSetting}
                willingCareerGuidance={willingCareerGuidance}
                willingDualDegrees={willingDualDegrees}
                willingAdviceClinicalRotations={willingAdviceClinicalRotations}
                willingResearch={willingResearch}
                willingResidency={willingResidency}
              />
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
            <RoleSpecificFields
              fields={{
                degrees,
                program,
                pceSite,
                currentYear,
                affiliations: makeOptions(affiliations),
              }}
              options={{
                programOptions: makeOptions(programOptions),
                pceSiteOptions: makeOptions(pceSiteOptions),
                currentYearOptions: makeOptions(currentYearOptions),
                hospitalOptions: makeOptions(hospitalOptions),
              }}
              handleChange={this.handleChange}
              handleCreate={this.handleCreate}
              handleChangeField={this.handleChangeField}
            />
            <div className="user-tip">
              In the following sections, in addition to choosing from the tags
              below, you may also create your own tags by typing them in and
              pressing enter. You may create as many tags as you would like.
            </div>
            <p>Clinical Interests</p>
            <CreatableTagSelect
              values={clinicalSpecialties}
              options={makeOptions(clinicalSpecialtyOptions)}
              handleChange={this.handleChange('clinicalSpecialties')}
              handleAdd={this.handleCreate('clinicalSpecialties')}
            />
            <p>Professional Interests</p>
            <CreatableTagSelect
              values={professionalInterests}
              options={makeOptions(professionalInterestOptions)}
              handleChange={this.handleChange('professionalInterests')}
              handleAdd={this.handleCreate('professionalInterests')}
            />
            <div className="user-tip">
              <p>
                Please use this section to share parts of your identity. This is
                where you may share optional demographic or personally
                meaningful information that is viewable by{' '}
                {isStudent && 'other '}students on Weave. Please{' '}
                <Link to="/help#how-do-i-create-my-own-tags" target="_blank">
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
                options={makeOptions(activitiesIEnjoyOptions)}
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
                ref={(el) => {
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

  render() {
    const { saved } = this.state

    return (
      <>
        <Prompt
          when={!saved}
          message="Your changes to your profile have not been saved. Navigate anyways?"
        />
        {this.renderForm()}
      </>
    )
  }
}
