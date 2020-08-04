// @flow
import React from 'react'

import ResultsView, { type Props } from './ResultsView'

import FacultyProfileResult from './FacultyProfileResult'

const FacultyResultsView = (props: Props) => (
  <ResultsView {...props} RoleSpecificProfileResult={FacultyProfileResult} />
)

export default FacultyResultsView
