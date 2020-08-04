// @flow
import React from 'react'

import ResultsView, { type Props } from './ResultsView'

import StudentProfileResult from './StudentProfileResult'

const StudentResultsView = (props: Props) => (
  <ResultsView {...props} RoleSpecificProfileResult={StudentProfileResult} />
)

export default StudentResultsView
