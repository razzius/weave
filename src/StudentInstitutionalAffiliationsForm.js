import React from 'react'

import InstitutionalAffiliationsForm from './InstitutionalAffiliationsForm'

export default function StudentInstitutionalAffiliationsForm(props) {
  return (
    <InstitutionalAffiliationsForm
      {...props}
      fieldName="Hospitals Where I Have Completed Rotations"
    />
  )
}
