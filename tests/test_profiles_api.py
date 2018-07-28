import http

from server.models import VerificationEmail, VerificationToken, db


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
    token = '1234'

    verification_email = VerificationEmail(email='test@test.com')

    db.session.add(verification_email)
    db.session.commit()

    verification_token = VerificationToken(token=token, email_id=verification_email.id)

    db.session.add(verification_token)
    db.session.commit()

    response = client.get('/api/profiles', headers={'Authorization': f'Token {token}'})

    assert response.status_code == http.HTTPStatus.OK.value

    assert response.json == []
