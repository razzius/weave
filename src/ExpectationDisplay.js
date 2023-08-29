import React from 'react'

function ExpectationDisplay({ name, value }) {
  const id = name.split().join('-')

  return (
    <div className="expectation">
      <label htmlFor={id} className={!value ? 'grayed-out' : ''}>
        <input id={id} type="checkbox" disabled checked={value} />
        {name}
      </label>
    </div>
  )
}

export default ExpectationDisplay
