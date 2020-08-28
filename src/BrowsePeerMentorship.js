import React from 'react'
import Browse from './Browse'
import { getPeerProfiles, getStudentSearchTags } from './api'
import StudentResultsView from './StudentResultsView'

const BrowsePeerMentorship = () => (
  <Browse
    getProfiles={getPeerProfiles}
    getSearchTags={getStudentSearchTags}
    profileBaseUrl="peer-profiles"
    RoleSpecificResultsView={StudentResultsView}
  />
)

export default BrowsePeerMentorship
