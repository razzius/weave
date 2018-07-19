import React, { Component } from "react"
import Select from 'react-select'
import {
  clinicalSpecialtyOptions,
  additionalInterestOptions,
  hospitalOptions
} from './options'

const options = clinicalSpecialtyOptions.concat(additionalInterestOptions, hospitalOptions)

export default class SearchInput extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.onSubmit()
  }

  handleInputKeyDown = (e) => {
    if (e.key === 'Enter'){
      this.props.onSubmit()
    }
  }

  render() {
    return (
      <form style={{display: 'flex'}} className="search" onSubmit={this.handleSubmit}>
        <Select
          style={{
            width: '500px',
          }}
          options={options}
          placeholder={"Search"}
          onBlurResetsInput={false}
          noResultsText={null}
          onChange={this.props.onChange}
          onInputChange={this.props.onInputChange}
          onInputKeyDown={this.handleInputKeyDown}
          value={this.props.value}
          multi
          />
        <button className="search-submit" type="submit">
          Submit
        </button>
      </form>
    )
  }
}
