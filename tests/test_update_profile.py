import datetime
import http

from freezegun import freeze_time

from server.models import Profile, VerificationEmail, VerificationToken

from .utils import save


MOCK_DATE = datetime.datetime(2019, 10, 21)


@freeze_time(MOCK_DATE)
def test_update_profile(client):
    token = '1234'

    verification_email = save(VerificationEmail(email='test@test.com'))

    save(VerificationToken(token=token, email_id=verification_email.id))

    profile = save(
        Profile(
            name='Test User',
            verification_email_id=verification_email.id,
            contact_email='test@test.com',
            cadence='monthly',
        )
    )

    new_profile = {
        'name': 'New User',
        'contact_email': 'new@test.com',
        'affiliations': [],
        'clinical_specialties': [],
        'professional_interests': [],
        'parts_of_me': [],
        'activities': [],
        'degrees': [],
    }

    response = client.put(
        f'/api/profiles/{profile.id}',
        json=new_profile,
        headers={'Authorization': f'Token {token}'},
    )

    assert response.status_code == http.HTTPStatus.OK.value

    check_json = {key: value for key, value in response.json.items() if key != 'id'}

    assert check_json == {
        'activities': [],
        'additional_information': '',
        'professional_interests': [],
        'affiliations': [],
        'cadence': 'monthly',
        'clinical_specialties': [],
        'degrees': [],
        'contact_email': 'new@test.com',
        'name': 'New User',
        'other_cadence': None,
        'parts_of_me': [],
        'profile_image_url': None,
        'willing_discuss_personal': False,
        'willing_goal_setting': False,
        'willing_networking': False,
        'willing_career_guidance': False,
        'willing_student_group': False,
        'willing_shadowing': False,
    }

    profile = Profile.query.first()

    assert profile.date_updated == MOCK_DATE
