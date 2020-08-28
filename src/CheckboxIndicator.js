// @flow
import React from 'react'
import MediaQuery from 'react-responsive'
import ReactTooltip from 'react-tooltip'

const CheckboxIndicator = ({
  title,
  checked,
}: {
  title: string,
  checked: boolean,
}) => {
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
          onClick={e => {
            e.preventDefault()
            ReactTooltip.show()
          }}
          data-tip={title}
          data-for="indicator"
        >
          {checkbox}
        </button>
      </MediaQuery>
    </>
  )
}

export default CheckboxIndicator
