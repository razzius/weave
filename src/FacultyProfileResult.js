// @flow
import React from 'react'

import CheckboxIndicator from './CheckboxIndicator'
import { capitalize } from './utils'

const FacultyProfileResult = ({ result }: { result: Object }) => {
  const formattedAffiliations = (
    <p>
      {result.affiliations.map((affiliation, index) => (
        <span key={affiliation} className="affiliation">
          {index === 0 ? ' ' : ', '}
          {affiliation}
        </span>
      ))}
    </p>
  )

  const degreesView = result.degrees.length ? (
    <span className="resultDegrees">{`, ${result.degrees.join(', ')}`}</span>
  ) : null

  const {
    willingShadowing,
    willingNetworking,
    willingGoalSetting,
    willingDiscussPersonal,
    willingCareerGuidance,
    willingStudentGroup,
  } = result

  return (
    <>
      <div className="profile-result-left">
        <h2>
          {result.name}
          {degreesView}
        </h2>
        {formattedAffiliations}
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

        <CheckboxIndicator title="Shadowing" checked={willingShadowing} />
        <CheckboxIndicator title="Networking" checked={willingNetworking} />
        <CheckboxIndicator title="Goal setting" checked={willingGoalSetting} />
        <CheckboxIndicator
          title="Discuss personal life"
          checked={willingDiscussPersonal}
        />
        <CheckboxIndicator
          title="Career guidance"
          checked={willingCareerGuidance}
        />
        <CheckboxIndicator
          title="Student group support"
          checked={willingStudentGroup}
        />
      </div>
    </>
  )
}

export default FacultyProfileResult
