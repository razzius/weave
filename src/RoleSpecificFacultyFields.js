// @flow
import React from 'react'

import CreatableTagSelect from './CreatableTagSelect'
import { degreeOptions } from './options'

const RoleSpecificFacultyFields = ({
  fields,
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
  </div>
)

export default RoleSpecificFacultyFields
