// @flow
import React from 'react'

import Select from 'react-select'

export type InstitutionalAffiliationsFormProps = {
  hospitalOptions: any,
  affiliations: any,
  handleChange: Function,
}

type Props = InstitutionalAffiliationsFormProps & {
  fieldName: string,
}

export default ({
  hospitalOptions,
  affiliations,
  handleChange,
  fieldName,
}: Props) => (
  <>
    <p>{fieldName}</p>
    <Select
      styles={{
        control: (base) => ({ ...base, backgroundColor: 'white' }),
        multiValue: (styles) => ({
          ...styles,
          backgroundColor: '#edf4fe',
        }),
      }}
      className="column"
      isMulti
      options={hospitalOptions}
      value={affiliations}
      onChange={handleChange}
    />
  </>
)
