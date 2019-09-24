// @flow
import React from 'react'

import CreatableTagSelect from './CreatableTagSelect'

type Props = {
  handleAdd: string => void,
  handleChange: Array => void,
  value: string,
}

const CreatableInputOnly = (props: Props) => (
  <CreatableTagSelect
    components={{ DropdownIndicator: null }}
    isClearable
    menuIsOpen={false}
    placeholder="Type something and press enter..."
    {...props}
  />
)

export default CreatableInputOnly
