import React from 'react'
import MediaQuery from 'react-responsive'

function CheckboxIndicator({ title, checked }) {
  const checkbox = (
    <input
      style={{
        marginRight: '6px',
        verticalAlign: 'middle',
        position: 'relative',
        bottom: '1px',
      }}
      disabled
      type="checkbox"
      checked={checked}
    />
  )

  return (
    <>
      <MediaQuery query="(min-device-width: 750px)">
        <div style={{ marginTop: '5px', marginBottom: '5px' }}>
          {checkbox}
          {title}
        </div>
      </MediaQuery>
      <MediaQuery query="(max-device-width: 750px)">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
          }}
          title={title}
        >
          {checkbox}
        </button>
      </MediaQuery>
    </>
  )
}

export default CheckboxIndicator
