// @flow
import React, { Component } from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
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

type Props = {
  onChange: Function,
  onInputChange: Function,
  onSubmit: Function,
  onKeyDown: Function,
  onChangeDegrees: Function,
  onChangeAffiliations: Function,
  values: Array<string>,
  inputValue: string,
  degrees: Array<string>,
  affiliations: Array<string>,
}

type KeyboardEvent = SyntheticKeyboardEvent<HTMLElement>

export default class SearchInput extends Component<Props> {
  handleSubmit = (e: KeyboardEvent) => {
    const { onSubmit } = this.props

    e.preventDefault()
    onSubmit()
  }

  render() {
    const {
      onChange,
      onInputChange,
      values,
      inputValue,
      onKeyDown,
      onChangeDegrees,
      degrees,
      onChangeAffiliations,
      affiliations,
    } = this.props

    return (
      <form className="search" onSubmit={this.handleSubmit}>
        <div style={{ display: 'flex', maxWidth: '700px' }}>
          {/* $FlowFixMe CreatableSelect props are not typechecking as expected */}
          <CreatableSelect
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
            onKeyDown={onKeyDown}
            value={labelValues(values)}
            inputValue={inputValue}
            createOptionPosition="first"
            formatCreateLabel={text => `Search "${text}"`}
          />
          <button className="search-submit" type="submit">
            Submit
          </button>
        </div>
        <div style={{ display: 'inline-block', marginTop: '6px' }}>
          <Select
            styles={{
              control: base => ({
                ...base,
                width: '250px',
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
        <div style={{ display: 'inline-block', marginLeft: '6px' }}>
          <Select
            styles={{
              control: base => ({
                ...base,
                width: '250px',
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
