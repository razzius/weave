import React, { Component } from 'react'
import Select from 'react-select'
import {
  clinicalSpecialtyOptions,
  professionalInterestOptions,
  hospitalOptions,
  degreeOptions,
  activitiesIEnjoyOptions,
} from './options'

const options = clinicalSpecialtyOptions.concat(
  professionalInterestOptions,
  hospitalOptions,
  activitiesIEnjoyOptions
)

export default class SearchInput extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.onSubmit()
  }

  handleInputKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.props.onSubmit()
    }
  }

  render() {
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
            onChange={this.props.onChange}
            onInputChange={this.props.onInputChange}
            value={this.props.value.map(value => ({ label: value, value }))}
            inputValue={this.props.inputValue}
            onKeyDown={this.handleInputKeyDown}
          />
          <button className="search-submit" type="submit">
            Submit
          </button>
        </div>
        <Select
          styles={{
            control: base => ({
              ...base,
              width: '200px',
              backgroundColor: 'white',
            }),
            multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' }),
          }}
          onChange={this.props.onChangeDegrees}
          value={this.props.degrees.map(value => ({ label: value, value }))}
          isMulti
          noOptionsMessage={() => null}
          options={degreeOptions}
          placeholder="Filter by degree"
        />
      </form>
    )
  }
}
