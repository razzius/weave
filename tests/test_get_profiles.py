import http

from server.models import ProfileStar, VerificationEmail, VerificationToken, save

from .utils import create_test_profile, create_test_verification_token


def test_get_profiles_missing_token(client):
    response = client.get('/api/profiles')

    assert response.status_code == http.HTTPStatus.UNAUTHORIZED.value

    assert response.json == {'token': ['missing']}


def test_get_profiles_bogus_token(client):
    token = '1234'

    response = client.get('/api/profiles', headers={'Authorization': f'Token {token}'})

    assert response.status_code == http.HTTPStatus.UNAUTHORIZED.value

    assert response.json == {'token': ['unknown token']}


def test_get_profiles_empty(client):
    verification_email = VerificationEmail(email='test@test.com')
    save(verification_email)

    verification_token = VerificationToken(token='1234', email_id=verification_email.id)
    save(verification_token)

    response = client.get(
        '/api/profiles', headers={'Authorization': f'Token {verification_token.token}'}
    )

    assert response.status_code == http.HTTPStatus.OK.value

    assert response.json == {'profile_count': 0, 'profiles': []}


def test_get_profiles_search_empty(client):
    verification_email = VerificationEmail(email='test@test.com')
    save(verification_email)

    verification_token = VerificationToken(token='1234', email_id=verification_email.id)
    save(verification_token)

    response = client.get(
        '/api/profiles',
        headers={'Authorization': f'Token {verification_token.token}'},
        query_string={'query': 'abc'},
    )

    assert response.status_code == http.HTTPStatus.OK.value

    assert response.json == {'profile_count': 0, 'profiles': []}


def test_get_starred_profile(client):
    verification_token = create_test_verification_token()

    starred_profile = create_test_profile(available_for_mentoring=True)

    save(
        ProfileStar(
            from_verification_email_id=verification_token.email.id,
            to_profile_id=starred_profile.id,
        )
    )

    response = client.get(
        '/api/profiles', headers={'Authorization': f'Token {verification_token.token}'}
    )

    assert response.json['profiles'][0]['starred']


def test_get_profile_other_user_starred(client):
    verification_token = create_test_verification_token()

    other_verification_token = create_test_verification_token()

    starred_profile = create_test_profile(available_for_mentoring=True)

    save(
        ProfileStar(
            from_verification_email_id=other_verification_token.email.id,
            to_profile_id=starred_profile.id,
        )
    )

    response = client.get(
        '/api/profiles', headers={'Authorization': f'Token {verification_token.token}'}
    )

    assert not response.json['profiles'][0]['starred']
