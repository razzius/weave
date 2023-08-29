import React, { Component } from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { displayDegreeOptions } from './options'

function labelValues(values) {
  if (values === null) {
    return null
  }
  return values.map(value => ({ label: value, value }))
}

export default class SearchInput extends Component {
  handleSubmit = e => {
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
      onChangeSorting,
      affiliations,
      menuOpen,
      onFocus,
      onBlur,
      searchableOptions,
      hospitalOptions,
      DegreeSelect,
    } = this.props

    return (
      <form className="search" onSubmit={this.handleSubmit}>
        <div style={{ display: 'flex', maxWidth: '700px' }}>
          <CreatableSelect
            className="fullWidth"
            styles={{
              control: base => ({
                ...base,
                width: '100%',
                backgroundColor: 'white',
              }),
              multiValue: styles => ({
                ...styles,
                backgroundColor: '#edf4fe',
              }),
            }}
            isMulti
            menuIsOpen={menuOpen}
            options={searchableOptions}
            placeholder="Search by tags or type any text and press enter"
            noOptionsMessage={() => null}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            onInputChange={onInputChange}
            onKeyDown={e => {
              onKeyDown(e)
            }}
            value={labelValues(values)}
            inputValue={inputValue}
            createOptionPosition="first"
            formatCreateLabel={text => `Search "${text}"`}
          />
          <button className="search-submit" type="submit">
            Submit
          </button>
        </div>

        {DegreeSelect && (
          <div
            style={{
              display: 'inline-block',
              marginTop: '6px',
              marginRight: '6px',
            }}
          >
            <DegreeSelect
              onChange={onChangeDegrees}
              value={labelValues(degrees)}
              displayDegreeOptions={displayDegreeOptions}
            />
          </div>
        )}

        <div style={{ display: 'inline-block' }}>
          <Select
            styles={{
              control: base => ({
                ...base,
                width: '250px',
                backgroundColor: 'white',
              }),
              multiValue: styles => ({
                ...styles,
                backgroundColor: '#edf4fe',
              }),
            }}
            onChange={onChangeAffiliations}
            value={labelValues(affiliations)}
            noOptionsMessage={() => null}
            options={hospitalOptions}
            placeholder="Filter by institution"
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
            }}
            options={[
              {
                label: 'Starred Profiles First',
                value: 'starred',
              },
              {
                label: 'Most Recently Updated',
                value: 'date_updated',
              },
              {
                label: 'Alphabetical',
                value: 'last_name_alphabetical',
              },
              {
                label: 'Reverse Alphabetical',
                value: 'last_name_reverse_alphabetical',
              },
            ]}
            onChange={onChangeSorting}
            placeholder="Sort order"
          />
        </div>
      </form>
    )
  }
}
