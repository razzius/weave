// @flow
import React from 'react'

import ExpectationCheckbox from './ExpectationCheckbox'

const RoleSpecificStudentCheckboxes = ({
  willingDiscussPersonal,
  willingAdviceClinicalRotations,
  willingAdviceClasses,
  willingResearch,
  willingResidency,
  willingStudentGroup,
  updateBoolean,
}: {
  willingDiscussPersonal: boolean,
  willingAdviceClinicalRotations: boolean,
  willingAdviceClasses: boolean,
  willingResearch: boolean,
  willingResidency: boolean,
  willingStudentGroup: boolean,
  updateBoolean: Function,
}) => (
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
      Give advice about clinical rotations
    </ExpectationCheckbox>

    <ExpectationCheckbox
      id="willing-advice-classes"
      value={willingAdviceClasses}
      onChange={updateBoolean('willingAdviceClasses')}
    >
      Give advice about classes
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
      Residency applications
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

export default RoleSpecificStudentCheckboxes
