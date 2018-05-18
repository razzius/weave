import additionalInterests from "./additionalInterests"
import hospitals from "./hospitals"
import clinicalSpecialties from "./clinicalSpecialties"

function makeOptions(list) {
  return list.map(item => ({
    label: item,
    value: item
  }))
}

export const clinicalSpecialtyOptions = makeOptions(clinicalSpecialties)

export const additionalInterestOptions = makeOptions(additionalInterests)

export const hospitalOptions = makeOptions(hospitals)
