import professionalInterests from './professionalInterests'
import hospitals from './hospitals'
import clinicalSpecialties from './clinicalSpecialties'
import activitiesIEnjoyTags from './activitiesIEnjoyTags'
import degrees from './degrees'

function makeOptions(list) {
  return list.map(item => ({
    label: item,
    value: item,
  }))
}

const displayDegrees = degrees.filter(
  degree => ![
    'DMD', 'DDS', 'MD', 'DO',
  ].includes(degree)
).concat(
  'DMD / DDS',
  'MD / DO',
).sort()

export const clinicalSpecialtyOptions = makeOptions(clinicalSpecialties)

export const professionalInterestOptions = makeOptions(professionalInterests)

export const hospitalOptions = makeOptions(hospitals)

export const activitiesIEnjoyOptions = makeOptions(activitiesIEnjoyTags)

export const degreeOptions = makeOptions(degrees)

export const displayDegreeOptions = makeOptions(displayDegrees)
