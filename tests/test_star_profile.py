from http import HTTPStatus

from server.models import ProfileStar

from .utils import create_test_profile


def test_must_be_logged_in_to_star_profile(client):
    response = client.post('/api/star_profile')

    assert response.status_code == HTTPStatus.UNAUTHORIZED.value


def test_must_specify_profile_to_be_starred(client):
    token = '1234'

    create_test_profile(token=token)

    response = client.post(
        '/api/star_profile', json={}, headers={'Authorization': f'Token {token}'}
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value

    assert response.json['profile_id'] == ['`profile_id` missing from request']


def test_must_star_valid_profile_id(client):
    token = '1234'

    create_test_profile(token=token)

    data = {'profile_id': 'asdf'}
    response = client.post(
        '/api/star_profile', json=data, headers={'Authorization': f'Token {token}'}
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value

    assert response.json['profile_id'] == ['`profile_id` invalid']


def test_star_profile(client):
    token = '123'

    profile = create_test_profile(token=token)
    other_profile = create_test_profile()

    data = {'profile_id': other_profile.id}

    response = client.post(
        '/api/star_profile', json=data, headers={'Authorization': f'Token {token}'}
    )

    assert response.status_code == HTTPStatus.OK.value

    assert response.json['to_id'] == other_profile.id
    assert response.json['from_id'] == profile.id

    star = ProfileStar.query.first()

    assert star.from_id == profile.id
    assert star.to_id == other_profile.id


def test_cannot_star_own_profile(client):
    token = '123'

    profile = create_test_profile(token=token)

    data = {'profile_id': profile.id}

    response = client.post(
        '/api/star_profile', json=data, headers={'Authorization': f'Token {token}'}
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value

    star = ProfileStar.query.first()

    assert star is None
