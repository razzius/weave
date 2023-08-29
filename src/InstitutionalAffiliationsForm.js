import React from 'react'

import Select from 'react-select'

export default function InstitutionalAffiliationsForm({
  hospitalOptions,
  affiliations,
  handleChange,
  fieldName,
}) {
  return (
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
}
