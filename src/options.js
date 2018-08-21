import professionalInterests from "./professionalInterests"
import hospitals from "./hospitals"
import clinicalSpecialties from "./clinicalSpecialties"
import partsOfMeTags from "./partsOfMeOptions"
import activitiesIEnjoyTags from "./activitiesIEnjoyTags"

function makeOptions(list) {
  return list.map(item => ({
    label: item,
    value: item
  }))
}

export const clinicalSpecialtyOptions = makeOptions(clinicalSpecialties)

export const professionalInterestOptions = makeOptions(professionalInterests)

export const hospitalOptions = makeOptions(hospitals)

export const partsOfMeOptions = makeOptions(partsOfMeTags)

export const activitiesIEnjoyOptions = makeOptions(activitiesIEnjoyTags)
