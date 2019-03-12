import React, { Component } from 'react'
import Select from 'react-select'
import {
  clinicalSpecialtyOptions,
  professionalInterestOptions,
  hospitalOptions,
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
        style={{ display: 'flex', maxWidth: '700px' }}
        className="search"
        onSubmit={this.handleSubmit}
      >
        <Select
          className="fullWidth"
          styles={{
            control: base => ({
              ...base,
              width: '100%',
              backgroundColor: 'white'
            }),
            multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' })
          }}
          isMulti
          options={options}
          placeholder={'Search'}
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
      </form>
    )
  }
}
