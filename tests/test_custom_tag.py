import datetime
import http

from freezegun import freeze_time
from server.models import (
    ActivityOption,
    Profile,
    VerificationEmail,
    VerificationToken,
    save
)


MOCK_DATE = datetime.datetime(2019, 12, 18, tzinfo=datetime.timezone.utc)


@freeze_time(MOCK_DATE)
def test_create_profile_with_custom_tag(client):
    token = '1234'

    name = 'New User'
    email = 'test@test.com'

    verification_email = save(VerificationEmail(email=email))

    save(VerificationToken(token=token, email_id=verification_email.id))

    clinical_specialties = ['Endocrinology, Diabetes & Metabolism']
    affiliations = ["Brigham and Women's Hospital"]

    professional_interests = ['Advocacy']
    parts_of_me = ['African American']
    activities = ['Surfing the web']
    degrees = ['MBA']

    profile = {
        'name': name,
        'contact_email': email,
        'clinical_specialties': clinical_specialties,
        'affiliations': affiliations,
        'professional_interests': professional_interests,
        'parts_of_me': parts_of_me,
        'activities': activities,
        'degrees': degrees,
        'cadence': 'monthly',
    }

    response = client.post(
        f'/api/profile', json=profile, headers={'Authorization': f'Token {token}'}
    )

    assert response.status_code == http.HTTPStatus.CREATED.value

    profile_id = Profile.query.all()[0].id

    expected_fields = {
        'id': profile_id,
        'date_updated': MOCK_DATE.isoformat(),
        'activities': activities,
        'professional_interests': professional_interests,
        'affiliations': affiliations,
        'clinical_specialties': clinical_specialties,
        'contact_email': email,
        'degrees': degrees,
        'name': name,
        'parts_of_me': parts_of_me,
    }

    assert expected_fields.items() <= response.json.items()

    assert ActivityOption.query.filter(ActivityOption.value == activities[0]).one()
