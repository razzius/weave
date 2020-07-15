// @flow
import React from 'react'
import Select from 'react-select'

const RoleSpecificStudentFields = ({
  fields,
  options,
  handleChangeField,
}: Object) => (
  <div>
    <p>Program</p>
    <Select
      onChange={handleChangeField('program')}
      options={options.programOptions}
      value={{ label: fields.program, value: fields.program }}
    />
    <p>Current Year</p>
    <Select
      onChange={handleChangeField('currentYear')}
      options={options.currentYearOptions}
      value={{ label: fields.currentYear, value: fields.currentYear }}
    />
    <p>PCE Site</p>
    <Select
      onChange={handleChangeField('pceSite')}
      options={options.pceSiteOptions}
      value={{ label: fields.pceSite, value: fields.pceSite }}
    />
  </div>
)

export default RoleSpecificStudentFields
