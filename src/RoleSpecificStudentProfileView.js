import React from 'react'

function RoleSpecificStudentProfileView({
  program,
  currentYear,
  pceSite,
  affiliations,
}) {
  return (
    <div>
      <h4>Program</h4>
      <p>{program}</p>
      <h4>Current Year</h4>
      <p>{currentYear}</p>
      <h4>PCE Site</h4>
      <p>{pceSite}</p>
      {affiliations.length > 0 && (
        <>
          <h4>Hospitals Where I Have Completed Rotations</h4>
          <p>{affiliations.join(', ')}</p>
        </>
      )}
    </div>
  )
}

export default RoleSpecificStudentProfileView
