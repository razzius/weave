from http import HTTPStatus

from server.models import ProfileStar, save

from .utils import create_test_profile, create_test_verification_token


def test_must_be_logged_in_to_star_profile(client):
    response = client.post("/api/star_profile")

    assert response.status_code == HTTPStatus.UNAUTHORIZED.value


def test_must_specify_profile_to_be_starred(client, auth):
    profile = create_test_profile()

    token = create_test_verification_token(
        verification_email=profile.verification_email
    )

    auth.login(token.token)

    response = client.post("/api/star_profile", json={})

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value

    assert response.json["profile_id"] == ["`profile_id` missing from request"]


def test_must_star_valid_profile_id(client, auth):
    profile = create_test_profile()

    token = create_test_verification_token(
        verification_email=profile.verification_email
    )

    data = {"profile_id": "asdf"}

    auth.login(token.token)

    response = client.post("/api/star_profile", json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value

    assert response.json["profile_id"] == ["`profile_id` invalid"]


def test_star_profile(client, auth):
    verification_token = create_test_verification_token()
    other_profile = create_test_profile()

    data = {"profile_id": other_profile.id}

    auth.login(verification_token.token)

    response = client.post("/api/star_profile", json=data)

    assert response.status_code == HTTPStatus.OK.value

    assert response.json["profile_id"] == other_profile.id

    star = ProfileStar.query.first()

    assert star.from_verification_email_id == verification_token.email.id
    assert star.to_verification_email_id == other_profile.verification_email_id


def test_cannot_star_own_profile(client, auth):
    profile = create_test_profile()

    token = create_test_verification_token(
        verification_email=profile.verification_email
    )

    data = {"profile_id": profile.id}

    auth.login(token.token)

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
            to_verification_email_id=profile.verification_email_id,
        )
    )

    data = {"profile_id": profile.id}

    auth.login(verification_token.token)

    response = client.post("/api/star_profile", json=data,)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value


def test_only_one_profile_starred(client, auth):
    verification_token = create_test_verification_token()

    to_star_profile = create_test_profile(available_for_mentoring=True)

    create_test_profile(available_for_mentoring=True)

    data = {"profile_id": to_star_profile.id}

    auth.login(verification_token.token)

    response = client.post("/api/star_profile", json=data)

    assert response.status_code == HTTPStatus.OK.value

    stars = ProfileStar.query.all()

    assert len(stars) == 1
    assert stars[0].to_verification_email_id == to_star_profile.verification_email_id

    profiles = client.get("/api/profiles")

    assert profiles.json["profile_count"] == 2
    assert profiles.json["profiles"][0]["starred"]
    assert not profiles.json["profiles"][1]["starred"]
