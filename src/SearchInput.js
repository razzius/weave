// @flow
import React, { Component } from 'react'
import Select from 'react-select'
import {
  clinicalSpecialtyOptions,
  professionalInterestOptions,
  hospitalOptions,
  displayDegreeOptions,
  activitiesIEnjoyOptions,
} from './options'

const options = clinicalSpecialtyOptions.concat(
  professionalInterestOptions,
  activitiesIEnjoyOptions
)

function labelValues(values) {
  return values.map(value => ({ label: value, value }))
}

type State = {}

type Props = {
  onChange: Function,
  onInputChange: Function,
  onSubmit: Function,
  onChangeDegrees: Function,
  onChangeAffiliations: Function,
  value: Array<string>,
  inputValue: string,
  degrees: Array<string>,
  affiliations: Array<string>,
}

type KeyboardEvent = SyntheticKeyboardEvent<HTMLElement>

export default class SearchInput extends Component<Props, State> {
  handleSubmit = (e: KeyboardEvent) => {
    const { onSubmit } = this.props

    e.preventDefault()
    onSubmit()
  }

  handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.handleSubmit(e)
    }
  }

  render() {
    const {
      onChange,
      onInputChange,
      value,
      inputValue,
      onChangeDegrees,
      degrees,
      onChangeAffiliations,
      affiliations,
    } = this.props

    return (
      <form
        /* style={{ display: 'flex', maxWidth: '700px' }} */
        className="search"
        onSubmit={this.handleSubmit}
      >
        <div style={{ display: 'flex', maxWidth: '700px' }}>
          <Select
            className="fullWidth"
            styles={{
              control: base => ({
                ...base,
                width: '100%',
                backgroundColor: 'white',
              }),
              multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' }),
            }}
            isMulti
            options={options}
            placeholder="Search"
            noOptionsMessage={() => null}
            onChange={onChange}
            onInputChange={onInputChange}
            value={labelValues(value)}
            inputValue={inputValue}
            onKeyDown={this.handleInputKeyDown}
          />
          <button className="search-submit" type="submit">
            Submit
          </button>
        </div>
        <div style={{ display: 'inline-block' }}>
          <Select
            styles={{
              control: base => ({
                ...base,
                width: '200px',
                backgroundColor: 'white',
              }),
              multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' }),
            }}
            onChange={onChangeDegrees}
            value={labelValues(degrees)}
            isMulti
            noOptionsMessage={() => null}
            options={displayDegreeOptions}
            placeholder="Filter by degree"
          />
        </div>
        <div style={{ display: 'inline-block' }}>
          <Select
            styles={{
              control: base => ({
                ...base,
                width: '200px',
                backgroundColor: 'white',
              }),
              multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' }),
            }}
            onChange={onChangeAffiliations}
            value={labelValues(affiliations)}
            isMulti
            noOptionsMessage={() => null}
            options={hospitalOptions}
            placeholder="Filter by institution"
          />
        </div>
      </form>
    )
  }
}
