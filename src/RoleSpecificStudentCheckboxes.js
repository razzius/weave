import React from 'react'

import ExpectationCheckbox from './ExpectationCheckbox'

function RoleSpecificStudentCheckboxes({
  willingDiscussPersonal,
  willingAdviceClinicalRotations,
  willingDualDegrees,
  willingResearch,
  willingResidency,
  willingStudentGroup,
  updateBoolean,
}) {
  return (
    <>
      <ExpectationCheckbox
        id="willing-discuss-personal"
        value={willingDiscussPersonal}
        onChange={updateBoolean('willingDiscussPersonal')}
      >
        Discuss personal and professional identities / interests
      </ExpectationCheckbox>

      <ExpectationCheckbox
        id="willing-advice-clinical-rotations"
        value={willingAdviceClinicalRotations}
        onChange={updateBoolean('willingAdviceClinicalRotations')}
      >
        Advice about classes / clinical rotations
      </ExpectationCheckbox>

      <ExpectationCheckbox
        id="willing-research"
        value={willingResearch}
        onChange={updateBoolean('willingResearch')}
      >
        Research
      </ExpectationCheckbox>

      <ExpectationCheckbox
        id="willing-residency"
        value={willingResidency}
        onChange={updateBoolean('willingResidency')}
      >
        Specialty selection / residency applications
      </ExpectationCheckbox>

      <ExpectationCheckbox
        id="willing-dual-degrees"
        value={willingDualDegrees}
        onChange={updateBoolean('willingDualDegrees')}
      >
        Fifth year / dual degrees
      </ExpectationCheckbox>

      <ExpectationCheckbox
        id="willing-student-group"
        value={willingStudentGroup}
        onChange={updateBoolean('willingStudentGroup')}
      >
        Student interest group support
      </ExpectationCheckbox>
    </>
  )
}

export default RoleSpecificStudentCheckboxes
