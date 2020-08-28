// @flow
import React from 'react'

import InstitutionalAffiliationsForm, {
  type InstitutionalAffiliationsFormProps,
} from './InstitutionalAffiliationsForm'

export default (props: InstitutionalAffiliationsFormProps) => (
  <InstitutionalAffiliationsForm
    {...props}
    fieldName="Hospitals Where I Have Completed Rotations"
  />
)
