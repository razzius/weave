import React from 'react'

import ResultsView from './ResultsView'

import StudentProfileResult from './StudentProfileResult'

const StudentResultsView = props => (
  <ResultsView {...props} RoleSpecificProfileResult={StudentProfileResult} />
)

export default StudentResultsView
