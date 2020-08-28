// @flow
import React, { type Node } from 'react'

const ExpectationCheckbox = ({
  id,
  value,
  onChange,
  children,
}: {
  id: string,
  value: boolean,
  onChange: Function,
  children: Node,
}) => (
  <div className="expectation">
    <label htmlFor={id}>
      <input id={id} type="checkbox" checked={value} onChange={onChange} />
      {children}
    </label>
  </div>
)

export default ExpectationCheckbox
