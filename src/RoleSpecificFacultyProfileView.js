// @flow
import React, { Fragment } from 'react'

const AcademicDegrees = ({ degrees }: { degrees: string }) => (
  <Fragment>
    <h4 style={{ marginTop: '2em' }}>Academic Degrees</h4>
    <p style={{ paddingBottom: '1em' }}>{degrees}</p>
  </Fragment>
)

const RoleSpecificFacultyProfileView = ({ degrees }: Object) => (
  <div>
    {degrees.length > 0 && <AcademicDegrees degrees={degrees.join(', ')} />}
  </div>
)

export default RoleSpecificFacultyProfileView
