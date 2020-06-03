from http import HTTPStatus

from server.models import VerificationEmail, VerificationToken, save
from server.views.api import LOGIN_TIMEOUT_STATUS

from .utils import create_test_verification_token


def test_verify_invalid_token(client):
    response = client.post("/api/verify-token", json={"token": "123"})
    assert response.status_code == HTTPStatus.UNAUTHORIZED.value
    assert response.json == {"token": ["not recognized"]}


def test_does_not_verify_logged_out_token(client):
    verification_token = create_test_verification_token()
    verification_token.logged_out = True
    save(verification_token)

    response = client.post(
        "/api/verify-token", json={"token": verification_token.token}
    )
    assert response.status_code == LOGIN_TIMEOUT_STATUS
    assert response.json == {"token": ["expired"]}


def test_verify_valid_token(client):
    token = "123"
    email = "test@test.com"

    verification_email = save(VerificationEmail(email=email, is_mentor=True))

    save(VerificationToken(token=token, email_id=verification_email.id))

    response = client.post("/api/verify-token", json={"token": token})

    assert response.status_code == HTTPStatus.OK.value

    assert response.json == {
        "available_for_mentoring": None,
        "email": "test@test.com",
        "is_admin": None,
        "profile_id": None,
        "is_mentor": True,
    }


def test_verify_token_logs_out_other_tokens(client):
    token = "123"
    email = "test@test.com"

    verification_email = save(VerificationEmail(email=email, is_mentor=True))

    prior_token = save(VerificationToken(token="1010", email_id=verification_email.id))

    save(VerificationToken(token=token, email_id=verification_email.id))

    response = client.post("/api/verify-token", json={"token": token})

    assert response.status_code == HTTPStatus.OK.value

    assert prior_token.logged_out
