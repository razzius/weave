// @flow
import React, { Fragment } from 'react'

const AcademicDegrees = ({ degrees }: { degrees: string }) => (
  <Fragment>
    <h4 style={{ marginTop: '2em' }}>Academic Degrees</h4>
    <p style={{ paddingBottom: '1em' }}>{degrees}</p>
  </Fragment>
)

const RoleSpecificFacultyProfileView = ({ affiliations, degrees }: Object) => (
  <div>
    {degrees.length > 0 && <AcademicDegrees degrees={degrees.join(', ')} />}
    {affiliations.length > 0 && (
      <>
        <h4>Institutional Affiliations</h4>
        <p>{affiliations.join(', ')}</p>
      </>
    )}
  </div>
)

export default RoleSpecificFacultyProfileView
