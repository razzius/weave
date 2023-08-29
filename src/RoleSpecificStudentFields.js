import React from 'react'
import Select from 'react-select'

import StudentInstitutionalAffiliationsForm from './StudentInstitutionalAffiliationsForm'

const RoleSpecificStudentFields = ({
  fields,
  options,
  handleChange,
  handleChangeField,
}) => (
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
    <StudentInstitutionalAffiliationsForm
      affiliations={fields.affiliations}
      hospitalOptions={options.hospitalOptions}
      handleChange={handleChange('affiliations')}
    />
  </div>
)

export default RoleSpecificStudentFields
