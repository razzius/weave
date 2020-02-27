// @flow
import React, { Component } from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { type OptionType } from 'react-select/src/types'
import { displayDegreeOptions } from './options'

function labelValues(values) {
  if (values === null) {
    return null
  }
  return values.map(value => ({ label: value, value }))
}

type Props = {
  onChange: Function,
  onInputChange: Function,
  onSubmit: Function,
  onKeyDown: Function,
  onChangeDegrees: Function,
  onChangeAffiliations: Function,
  onChangeSorting: Function,
  values: Array<string>,
  inputValue: string,
  degrees: Array<string>,
  affiliations: Array<string>,
  menuOpen: boolean,
  onFocus: Function,
  onBlur: Function,
  searchableOptions: Array<string>,
  hospitalOptions: Array<OptionType>,
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
      onChangeSorting,
      affiliations,
      menuOpen,
      onFocus,
      onBlur,
      searchableOptions,
      hospitalOptions,
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
            menuIsOpen={menuOpen}
            options={searchableOptions}
            placeholder="Search"
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
                label: 'Most Recently Updated',
                value: { sorting: 'date_updated', ascending: false },
              },
              {
                label: 'Alphabetical',
                value: { sorting: 'last_name', ascending: true },
              },
              {
                label: 'Reverse Alphabetical',
                value: { sorting: 'last_name', ascending: false },
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
