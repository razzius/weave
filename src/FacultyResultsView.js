import React from 'react'

import ResultsView from './ResultsView'

import FacultyProfileResult from './FacultyProfileResult'

function FacultyResultsView(props) {
  return (
    <ResultsView {...props} RoleSpecificProfileResult={FacultyProfileResult} />
  )
}

export default FacultyResultsView
