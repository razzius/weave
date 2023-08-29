import React from 'react'

function ExpectationCheckbox({ id, value, onChange, children }) {
  return (
    <div className="expectation">
      <label htmlFor={id}>
        <input id={id} type="checkbox" checked={value} onChange={onChange} />
        {children}
      </label>
    </div>
  )
}

export default ExpectationCheckbox
