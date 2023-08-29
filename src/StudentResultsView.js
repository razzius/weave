import React from 'react'

import ResultsView from './ResultsView'

import StudentProfileResult from './StudentProfileResult'

function StudentResultsView(props) {
  return (
    <ResultsView {...props} RoleSpecificProfileResult={StudentProfileResult} />
  )
}

export default StudentResultsView
