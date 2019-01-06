// @flow
import React, { Fragment } from 'react';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';
import { capitalize } from './utils';
import ProfileAvatar from './ProfileAvatar';

const CheckboxIndicator = ({
  title,
  checked,
}: {
  title: string,
  checked: boolean,
}) => (
  <Fragment>
    <MediaQuery query="(min-device-width: 750px)">
      <div style={{ marginTop: '5px', marginBottom: '5px' }}>
        <input
          style={{
            marginRight: '6px',
            verticalAlign: 'middle',
            position: 'relative',
            bottom: '1px',
          }}
          disabled
          title={title}
          type="checkbox"
          checked={checked}
        />
        {title}
      </div>
    </MediaQuery>
    <MediaQuery query="(max-device-width: 750px)">nice smal</MediaQuery>
  </Fragment>
);

const ProfileResult = ({
  id,
  affiliations,
  profileImageUrl,
  name,
  clinicalSpecialties,
  professionalInterests,
  cadence,
  willingShadowing,
  willingNetworking,
  willingGoalSetting,
  willingDiscussPersonal,
  willingCareerGuidance,
  willingStudentGroup,
}: {
  id: number,
  affiliations: Array<string>,
  profileImageUrl: string,
  name: string,
  clinicalSpecialties: Array<string>,
  professionalInterests: Array<string>,
  cadence: string,
  willingShadowing: boolean,
  willingNetworking: boolean,
  willingGoalSetting: boolean,
  willingDiscussPersonal: boolean,
  willingCareerGuidance: boolean,
  willingStudentGroup: boolean,
}) => {
  const formattedAffiliations = (
    <p>
      {affiliations.map((affiliation, index) => (
        <span key={affiliation} className="affiliation">
          {index === 0 ? ' ' : ', '}
          {affiliation}
        </span>
      ))}
    </p>
  );

  return (
    <div style={{ paddingBottom: '3em' }}>
      <Link to={`/profiles/${id}`} className="profile-result">
        <ProfileAvatar
          profileImageUrl={profileImageUrl}
          name={name}
          size={160}
        />
        <div style={{ flex: '1 1 auto', flexBasis: '400px' }}>
          <h2>{name}</h2>
          {formattedAffiliations}
          <p className="clinical-interests">
            {clinicalSpecialties.map(interest => (
              <span key={interest} className="clinical interest">
                {' '}
                {interest}{' '}
              </span>
            ))}
          </p>
          <p>
            {professionalInterests.map(interest => (
              <span key={interest} className="professional interest">
                {' '}
                {interest}{' '}
              </span>
            ))}
          </p>
        </div>
        <div style={{ flexBasis: '200px', flexShrink: '0' }}>
          <div>
            <p>Cadence: {capitalize(cadence)}</p>
          </div>

          <CheckboxIndicator title="Shadowing" checked={willingShadowing} />
          <CheckboxIndicator title="Networking" checked={willingNetworking} />
          <CheckboxIndicator
            title="Goal setting"
            checked={willingGoalSetting}
          />
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
      </Link>
    </div>
  );
};

export default ProfileResult;
