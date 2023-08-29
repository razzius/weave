import React from 'react'

import ExpectationCheckbox from './ExpectationCheckbox'

const RoleSpecificFacultyCheckboxes = ({
  willingShadowing,
  willingNetworking,
  willingGoalSetting,
  willingDiscussPersonal,
  willingCareerGuidance,
  willingStudentGroup,
  updateBoolean,
}) => (
  <>
    <ExpectationCheckbox
      id="willing-shadowing"
      value={willingShadowing}
      onChange={updateBoolean('willingShadowing')}
    >
      Clinical shadowing opportunities
    </ExpectationCheckbox>

    <ExpectationCheckbox
      id="willing-networking"
      value={willingNetworking}
      onChange={updateBoolean('willingNetworking')}
    >
      Networking
    </ExpectationCheckbox>

    <ExpectationCheckbox
      id="willing-goal-setting"
      value={willingGoalSetting}
      onChange={updateBoolean('willingGoalSetting')}
    >
      Goal setting
    </ExpectationCheckbox>

    <ExpectationCheckbox
      id="willing-discuss-personal"
      value={willingDiscussPersonal}
      onChange={updateBoolean('willingDiscussPersonal')}
    >
      Discussing personal as well as professional life
    </ExpectationCheckbox>

    <ExpectationCheckbox
      id="willing-career-guidance"
      value={willingCareerGuidance}
      onChange={updateBoolean('willingCareerGuidance')}
    >
      Career guidance
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

export default RoleSpecificFacultyCheckboxes
