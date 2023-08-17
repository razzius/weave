import datetime

from server.models import save

from .utils import create_test_verification_token


def test_get_account(client, auth, db_session):
    verification_token = create_test_verification_token()

    auth.login(verification_token.token)

    response = client.get("/api/account")

    assert response.status_code == 200

    verification_email = verification_token.email

    assert response.json == {
        "email": verification_token.email.email,
        "is_faculty": verification_email.is_faculty,
        "is_admin": verification_email.is_admin,
        "profile_id": None,
        "available_for_mentoring": None,
    }


def test_get_expired_account(client, auth, db_session):
    verification_token = create_test_verification_token()

    auth.login(verification_token.token)

    verification_token.date_created = datetime.datetime(2000, 1, 1, tzinfo=datetime.timezone.utc)
    save(verification_token)

    response = client.get("/api/account")

    assert response.status_code == 440

    assert response.json == {"token": ["expired"]}
