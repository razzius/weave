import React from 'react'

import ResultsView from './ResultsView'

import FacultyProfileResult from './FacultyProfileResult'

const FacultyResultsView = props => (
  <ResultsView {...props} RoleSpecificProfileResult={FacultyProfileResult} />
)

export default FacultyResultsView
