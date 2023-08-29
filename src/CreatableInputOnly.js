import React from 'react'

import CreatableTagSelect from './CreatableTagSelect'

const CreatableInputOnly = ({ handleAdd, handleChange, values }) => (
  <CreatableTagSelect
    components={{ DropdownIndicator: null }}
    isClearable
    menuIsOpen={false}
    placeholder="Type something and press enter..."
    handleAdd={handleAdd}
    handleChange={handleChange}
    values={values}
  />
)

export default CreatableInputOnly
