import React from 'react'
import Browse from './Browse'
import { getProfiles } from './api'

const BrowseFaculty = () => <Browse getProfiles={getProfiles} />

export default BrowseFaculty
