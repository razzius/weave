import React from 'react'

import CreatableTagSelect from './CreatableTagSelect'

function CreatableInputOnly({ handleAdd, handleChange, values }) {
  return (
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
}

export default CreatableInputOnly
