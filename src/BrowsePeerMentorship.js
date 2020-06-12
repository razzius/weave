import React from 'react'
import Browse from './Browse'
import { getPeerProfiles } from './api'

const BrowsePeerMentorship = () => <Browse getProfiles={getPeerProfiles} />

export default BrowsePeerMentorship
