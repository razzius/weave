from .utils import create_test_verification_token


def test_get_account(client, auth):
    verification_token = create_test_verification_token()

    auth.login(verification_token.token)

    response = client.get('/api/account')

    assert response.status_code == 200

    verification_email = verification_token.email

    assert response.json == {
        "email": verification_token.email.email,
        "is_mentor": verification_email.is_mentor,
        "is_admin": verification_email.is_admin,
        "profile_id": None,
        "available_for_mentoring": None,
    }
