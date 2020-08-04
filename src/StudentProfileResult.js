// @flow
import React from 'react'

import { capitalize } from './utils'
import CheckboxIndicator from './CheckboxIndicator'

const StudentProfileResult = ({ result }: { result: Object }) => {
  const {
    willingDiscussPersonal,
    willingAdviceClinicalRotations,
    willingAdviceClasses,
    willingResearch,
    willingResidency,
    willingStudentGroup,
  } = result

  return (
    <>
      <div className="profile-result-left">
        <h2>{result.name}</h2>
        <p className="clinical-interests">
          {result.clinicalSpecialties.map(interest => (
            <span key={interest} className="clinical interest">
              {' '}
              {interest}{' '}
            </span>
          ))}
        </p>
        <p>
          {result.professionalInterests.map(interest => (
            <span key={interest} className="professional interest">
              {' '}
              {interest}{' '}
            </span>
          ))}
        </p>
      </div>
      <div className="profile-result-right">
        <div>
          <p>Cadence: {capitalize(result.cadence)}</p>
        </div>

        <CheckboxIndicator
          title="Discuss personal life"
          checked={willingDiscussPersonal}
        />
        <CheckboxIndicator
          title="Clinical rotations advice"
          checked={willingAdviceClinicalRotations}
        />
        <CheckboxIndicator
          title="Advice about classes"
          checked={willingAdviceClasses}
        />
        <CheckboxIndicator title="Research" checked={willingResearch} />
        <CheckboxIndicator
          title="Residency applications"
          checked={willingResidency}
        />
        <CheckboxIndicator
          title="Student group support"
          checked={willingStudentGroup}
        />
      </div>
    </>
  )
}

export default StudentProfileResult
