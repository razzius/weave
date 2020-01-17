import datetime
import http

from freezegun import freeze_time

from server.models import Profile, VerificationEmail, VerificationToken

from .utils import save


MOCK_DATE = datetime.datetime(2019, 10, 21)

PROFILE_UPDATE = {
    'name': 'New User',
    'contact_email': 'new@test.com',
    'affiliations': [],
    'clinical_specialties': [],
    'professional_interests': [],
    'parts_of_me': [],
    'activities': [],
    'degrees': [],
}


def create_test_profile(token, email='test@test.com', is_admin=False):
    verification_email = save(VerificationEmail(email=email, is_admin=is_admin))

    save(VerificationToken(token=token, email_id=verification_email.id))

    profile = save(
        Profile(
            name='Test User',
            verification_email_id=verification_email.id,
            contact_email=email,
            cadence='monthly',
        )
    )

    return profile


@freeze_time(MOCK_DATE)
def test_update_profile(client):
    token = '1234'

    profile = create_test_profile(token)

    response = client.put(
        f'/api/profiles/{profile.id}',
        json=PROFILE_UPDATE,
        headers={'Authorization': f'Token {token}'},
    )

    assert response.status_code == http.HTTPStatus.OK.value

    check_json = {
        key: value
        for key, value in response.json.items()
        if key not in {'id', 'date_updated'}
    }

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


def test_admin_update_does_not_update_date(client):
    admin_token = 'admin'
    create_test_profile(admin_token, email='admin@test.com', is_admin=True)

    profile = create_test_profile('abcd')

    original_profile_date_updated = profile.date_updated

    response = client.put(
        f'/api/profiles/{profile.id}',
        json=PROFILE_UPDATE,
        headers={'Authorization': f'Token {admin_token}'},
    )

    assert response.status_code == http.HTTPStatus.OK.value

    assert profile.date_updated == original_profile_date_updated


def test_tags_cannot_have_trailing_spaces(client):
    token = 'abcd'

    update = {
        **PROFILE_UPDATE,
        'clinical_specialties': ['Test '],
    }

    profile = create_test_profile(token)

    response = client.put(
        f'/api/profiles/{profile.id}',
        json=update,
        headers={'Authorization': f'Token {token}'},
    )

    assert response.status_code == http.HTTPStatus.OK.value

    assert profile.clinical_specialties[0].tag.value == 'Test'
