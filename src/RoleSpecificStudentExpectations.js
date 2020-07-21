// @flow
import React, { Fragment } from 'react'

import ExpectationDisplay from './ExpectationDisplay'

const RoleSpecificStudentExpectations = ({
  willingDiscussPersonal,
  willingAdviceClinicalRotations,
  willingAdviceClasses,
  willingResearch,
  willingResidency,
  willingStudentGroup,
}: {
  willingDiscussPersonal: boolean,
  willingAdviceClinicalRotations: boolean,
  willingAdviceClasses: boolean,
  willingResearch: boolean,
  willingResidency: boolean,
  willingStudentGroup: boolean,
}) => (
  <Fragment>
    <h4>I am available to help in the following ways:</h4>

    <ExpectationDisplay
      value={willingDiscussPersonal}
      name="Discuss personal as well as professional life"
    />

    <ExpectationDisplay
      value={willingAdviceClinicalRotations}
      name="Give advice about clinical rotations"
    />

    <ExpectationDisplay
      value={willingAdviceClasses}
      name="Give advice about classes"
    />

    <ExpectationDisplay value={willingResearch} name="Research" />

    <ExpectationDisplay
      value={willingResidency}
      name="Residency applications"
    />

    <ExpectationDisplay
      value={willingStudentGroup}
      name="Student interest group support"
    />
  </Fragment>
)

export default RoleSpecificStudentExpectations
