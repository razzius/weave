// @flow
import React, { Fragment } from 'react'

import ExpectationDisplay from './ExpectationDisplay'

const RoleSpecificFacultyExpectations = ({
  willingShadowing,
  willingNetworking,
  willingGoalSetting,
  willingDiscussPersonal,
  willingCareerGuidance,
  willingStudentGroup,
}: {
  willingShadowing: boolean,
  willingNetworking: boolean,
  willingGoalSetting: boolean,
  willingDiscussPersonal: boolean,
  willingCareerGuidance: boolean,
  willingStudentGroup: boolean,
}) => (
  <Fragment>
    <h4>I am available to help in the following ways:</h4>

    <ExpectationDisplay
      name="Clinical shadowing opportunities"
      value={willingShadowing}
    />

    <ExpectationDisplay name="Networking" value={willingNetworking} />

    <ExpectationDisplay name="Goal setting" value={willingGoalSetting} />

    <ExpectationDisplay
      name="Discussing personal as well as professional life"
      value={willingDiscussPersonal}
    />

    <ExpectationDisplay name="Career guidance" value={willingCareerGuidance} />
    <ExpectationDisplay
      name="Student interest group support or speaking at student events"
      value={willingStudentGroup}
    />
  </Fragment>
)

export default RoleSpecificFacultyExpectations
