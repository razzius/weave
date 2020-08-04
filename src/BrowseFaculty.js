// @flow
import React from 'react'
import Select from 'react-select'

import Browse from './Browse'
import { getProfiles } from './api'

import FacultyResultsView from './FacultyResultsView'

const DegreeSelect = ({ onChange, value, displayDegreeOptions }: Object) => (
  <Select
    styles={{
      control: base => ({
        ...base,
        width: '250px',
        backgroundColor: 'white',
      }),
      multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' }),
    }}
    onChange={onChange}
    value={value}
    isMulti
    noOptionsMessage={() => null}
    options={displayDegreeOptions}
    placeholder="Filter by degree"
  />
)

const BrowseFaculty = () => (
  <Browse
    getProfiles={getProfiles}
    profileBaseUrl="profiles"
    DegreeSelect={DegreeSelect}
    RoleSpecificResultsView={FacultyResultsView}
  />
)

export default BrowseFaculty
