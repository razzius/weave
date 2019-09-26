// @flow
import React from 'react'

import CreatableTagSelect from './CreatableTagSelect'

type Props = {
  handleAdd: string => void,
  handleChange: Array => void,
  value: string,
}

const CreatableInputOnly = ({ handleAdd, handleChange, value }: Props) => (
  <CreatableTagSelect
    components={{ DropdownIndicator: null }}
    isClearable
    menuIsOpen={false}
    placeholder="Type something and press enter..."
    handleAdd={handleAdd}
    handleChange={handleChange}
    value={value}
  />
)

export default CreatableInputOnly
