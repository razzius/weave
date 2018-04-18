import tags from './tags'
import hospitals from './hospitals'

export const interestOptions = tags.map(tag => ({
  label: tag, value: tag
}))

export const hospitalOptions = hospitals.map(hospital => ({
  label: hospital, value: hospital
}))
