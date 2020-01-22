import http

from server.models import VerificationEmail, VerificationToken, save


def test_get_profiles_unauthorized(client):
    response = client.get('/api/profiles')

    assert response.status_code == http.HTTPStatus.UNAUTHORIZED.value

    assert response.json == {'token': ['unauthorized']}


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
