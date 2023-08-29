import React from 'react'
import Select from 'react-select'

import Browse from './Browse'
import { getProfiles, getFacultySearchTags } from './api'

import FacultyResultsView from './FacultyResultsView'

const DegreeSelect = ({ onChange, value, displayDegreeOptions }) => (
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
    getSearchTags={getFacultySearchTags}
    profileBaseUrl="profiles"
    DegreeSelect={DegreeSelect}
    RoleSpecificResultsView={FacultyResultsView}
  />
)

export default BrowseFaculty
