from http import HTTPStatus

from server.models import ProfileStar, save

from .utils import create_test_profile, create_test_verification_token


def test_get_starred_profile(client):
    verification_token = create_test_verification_token()

    profile = create_test_profile()

    save(
        ProfileStar(
            from_verification_email_id=verification_token.email_id,
            to_profile_id=profile.id,
        )
    )

    response = client.get(
        f'/api/profiles/{profile.id}',
        headers={'Authorization': f'Token {verification_token.token}'},
    )

    assert response.status_code == HTTPStatus.OK.value

    assert response.json['starred']
