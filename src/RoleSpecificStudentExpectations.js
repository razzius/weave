// @flow
import React, { Fragment } from 'react'

import ExpectationDisplay from './ExpectationDisplay'

const RoleSpecificStudentExpectations = ({
  willingDiscussPersonal,
  willingAdviceClinicalRotations,
  willingDualDegrees,
  willingResearch,
  willingResidency,
  willingStudentGroup,
}: {
  willingDiscussPersonal: boolean,
  willingAdviceClinicalRotations: boolean,
  willingDualDegrees: boolean,
  willingResearch: boolean,
  willingResidency: boolean,
  willingStudentGroup: boolean,
}) => (
  <Fragment>
    <h4>I am available to help in the following ways:</h4>

    <ExpectationDisplay
      value={willingDiscussPersonal}
      name="Discuss personal and professional identities / interests"
    />

    <ExpectationDisplay
      value={willingAdviceClinicalRotations}
      name="Advice about classes / clinical rotations"
    />

    <ExpectationDisplay value={willingResearch} name="Research" />

    <ExpectationDisplay
      value={willingResidency}
      name="Specialty selection / residency applications"
    />

    <ExpectationDisplay
      value={willingDualDegrees}
      name="Fifth year / dual degrees"
    />

    <ExpectationDisplay
      value={willingStudentGroup}
      name="Student interest group support"
    />
  </Fragment>
)

export default RoleSpecificStudentExpectations
