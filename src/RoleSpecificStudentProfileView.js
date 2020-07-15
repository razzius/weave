// @flow
import React from 'react'

const RoleSpecificStudentProfileView = (data: Object) => (
  <div>
    <h4>Program</h4>
    <p>{data.program}</p>
    <h4>Current Year</h4>
    <p>{data.currentYear}</p>
    <h4>PCE Site</h4>
    <p>{data.pceSite}</p>
  </div>
)

export default RoleSpecificStudentProfileView
