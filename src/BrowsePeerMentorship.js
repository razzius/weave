import React from 'react'
import Browse from './Browse'
import { getPeerProfiles } from './api'
import StudentResultsView from './StudentResultsView'

const BrowsePeerMentorship = () => (
  <Browse
    getProfiles={getPeerProfiles}
    profileBaseUrl="peer-profiles"
    RoleSpecificResultsView={StudentResultsView}
  />
)

export default BrowsePeerMentorship
