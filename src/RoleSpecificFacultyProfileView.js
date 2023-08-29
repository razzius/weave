import React, { Fragment } from 'react'

function AcademicDegrees({ degrees }) {
  return (
    <Fragment>
      <h4 style={{ marginTop: '2em' }}>Academic Degrees</h4>
      <p style={{ paddingBottom: '1em' }}>{degrees.join(', ')}</p>
    </Fragment>
  )
}

function RoleSpecificFacultyProfileView({ affiliations, degrees }) {
  return (
    <div>
      {degrees.length > 0 && <AcademicDegrees degrees={degrees} />}
      {affiliations.length > 0 && (
        <>
          <h4>Institutional Affiliations</h4>
          <p>{affiliations.join(', ')}</p>
        </>
      )}
    </div>
  )
}

export default RoleSpecificFacultyProfileView
