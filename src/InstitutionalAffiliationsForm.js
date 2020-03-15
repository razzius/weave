// @flow
import React from 'react'

import Select from 'react-select'
import { makeOptions } from './options'

export default ({
  hospitalOptions,
  affiliations,
  handleChange,
}: {
  hospitalOptions: any,
  affiliations: any,
  handleChange: Function,
}) => (
  <>
    <p>Institutional Affiliations</p>
    <Select
      styles={{
        control: base => ({ ...base, backgroundColor: 'white' }),
        multiValue: styles => ({
          ...styles,
          backgroundColor: '#edf4fe',
        }),
      }}
      className="column"
      isMulti
      options={makeOptions(hospitalOptions)}
      value={affiliations}
      onChange={handleChange}
    />
  </>
)
