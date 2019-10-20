// @flow
import React from 'react'
import { type OptionType } from 'react-select/src/types'

import CreatableTagSelect from './CreatableTagSelect'

type Props = {
  handleAdd: string => void,
  handleChange: OptionType => void,
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
  />
)

export default CreatableInputOnly
