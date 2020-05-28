from http import HTTPStatus

from server.models import ProfileStar, save

from .utils import create_test_profile, create_test_verification_token


def test_must_be_logged_in_to_star_profile(client):
    response = client.post("/api/star_profile")

    assert response.status_code == HTTPStatus.UNAUTHORIZED.value


def test_must_specify_profile_to_be_starred(client, auth):
    token = "1234"

    create_test_profile(token=token)

    auth.login(token)

    response = client.post("/api/star_profile", json={})

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value

    assert response.json["profile_id"] == ["`profile_id` missing from request"]


def test_must_star_valid_profile_id(client, auth):
    token = "1234"

    create_test_profile(token=token)

    data = {"profile_id": "asdf"}

    auth.login(token)

    response = client.post("/api/star_profile", json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value

    assert response.json["profile_id"] == ["`profile_id` invalid"]


def test_star_profile(client, auth):
    verification_token = create_test_verification_token()
    other_profile = create_test_profile()

    data = {"profile_id": other_profile.id}

    auth.login(verification_token.token)

    response = client.post("/api/star_profile", json=data,)

    assert response.status_code == HTTPStatus.OK.value

    assert response.json["profile_id"] == other_profile.id

    star = ProfileStar.query.first()

    assert star.from_verification_email_id == verification_token.email.id
    assert star.to_profile_id == other_profile.id


def test_cannot_star_own_profile(client, auth):
    token = "1234"

    profile = create_test_profile(token=token)

    data = {"profile_id": profile.id}

    auth.login(token)

    response = client.post("/api/star_profile", json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value

    star = ProfileStar.query.first()

    assert star is None


def test_cannot_star_profile_twice(client, auth):
    verification_token = create_test_verification_token()

    profile = create_test_profile()

    save(
        ProfileStar(
            from_verification_email_id=verification_token.email_id,
            to_profile_id=profile.id,
        )
    )

    data = {"profile_id": profile.id}

    auth.login(verification_token.token)

    response = client.post("/api/star_profile", json=data,)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value
