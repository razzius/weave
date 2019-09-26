// @flow
import React from 'react'

import CreatableTagSelect from './CreatableTagSelect'

type Props = {
  handleAdd: string => void,
  handleChange: Array => void,
  values: Array<string>,
}

const CreatableInputOnly = ({ handleAdd, handleChange, values }: Props) => (
  <CreatableTagSelect
    components={{ DropdownIndicator: null }}
    isClearable
    menuIsOpen={false}
    placeholder="Type something and press enter..."
    handleAdd={handleAdd}
    handleChange={handleChange}
    values={values}
    noOptionsMessage={() => null}
    splitOnPunctuation
  />
)

export default CreatableInputOnly
