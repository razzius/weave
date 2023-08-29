import degrees from './degrees'

export function makeOptions(list) {
  return list.map((item) => ({
    label: item,
    value: item,
  }))
}

const displayDegrees = degrees
  .filter((degree) => !['DMD', 'DDS', 'MD', 'DO'].includes(degree))
  .concat('DMD / DDS', 'MD / DO')
  .sort()

export const degreeOptions = makeOptions(degrees)

export const displayDegreeOptions = makeOptions(displayDegrees)
