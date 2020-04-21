// @flow
import React from 'react'

import CreatableTagSelect from './CreatableTagSelect'
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
    <p>Hospitals Where I Have Completed Rotations</p>
    <CreatableTagSelect
      options={makeOptions(hospitalOptions)}
      values={affiliations}
      onChange={handleChange}
      handleAdd={() => {}}
    />
  </>
)
