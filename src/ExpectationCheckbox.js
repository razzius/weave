import React from 'react'

const ExpectationCheckbox = ({ id, value, onChange, children }) => (
  <div className="expectation">
    <label htmlFor={id}>
      <input id={id} type="checkbox" checked={value} onChange={onChange} />
      {children}
    </label>
  </div>
)

export default ExpectationCheckbox
