// @flow
import React from 'react'

import CreatableTagSelect from './CreatableTagSelect'
import { degreeOptions } from './options'
import FacultyInstitutionalAffiliationsForm from './FacultyInstitutionalAffiliationsForm'

const RoleSpecificFacultyFields = ({
  fields,
  options,
  handleChange,
  handleCreate,
}: Object) => (
  <div>
    <p>Academic Degrees</p>
    <CreatableTagSelect
      values={fields.degrees}
      options={degreeOptions}
      handleChange={handleChange('degrees')}
      handleAdd={handleCreate('degrees')}
    />
    <FacultyInstitutionalAffiliationsForm
      affiliations={fields.affiliations}
      hospitalOptions={options.hospitalOptions}
      handleChange={handleChange('affiliations')}
    />
  </div>
)

export default RoleSpecificFacultyFields
