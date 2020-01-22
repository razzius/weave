import uuid
import datetime
from server.models import Profile
import http

from server.models import VerificationEmail, VerificationToken, save


def create_profile(email, name, date_updated):
    verification_email = VerificationEmail(email=email)
    save(verification_email)

    verification_token = VerificationToken(token=str(uuid.uuid4()), email_id=verification_email.id)
    save(verification_token)

    profile = Profile(
        name=name,
        contact_email=email,
        verification_email_id=verification_email.id,
        cadence='monthly',
        date_updated=date_updated
    )
    save(profile)
    return profile


def test_sort_profiles_by_date_updated(client):
    own_profile = create_profile(
        email='test@test.com',
        name='Own Profile',
        date_updated=datetime.datetime(2018, 1, 1)
    )

    recently_updated_profile = create_profile(
        email='updated@test.com',
        name='Z',
        date_updated=datetime.datetime(2019, 10, 1)
    )

    not_recently_updated_profile = create_profile(
        email='not_updated@test.com',
        name='A',
        date_updated=datetime.datetime(2017, 10, 1)
    )

    own_token = own_profile.verification_email.verification_tokens[0].token

    response = client.get(
        '/api/profiles?sort=date_updated',
        headers={'Authorization': f'Token {own_token}'},
    )

    assert response.status_code == http.HTTPStatus.OK.value

    assert response.json['profileCount'] == 3

    results = response.json['profiles']

    assert results[0]['id'] == own_profile.id
    assert results[1]['id'] == recently_updated_profile.id
    assert results[2]['id'] == not_recently_updated_profile.id
