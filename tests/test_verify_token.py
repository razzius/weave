from http import HTTPStatus

from server.models import VerificationEmail, VerificationToken, save


def test_verify_invalid_token(client):
    response = client.post("/api/verify-token", json={"token": "123"})
    assert response.status_code == HTTPStatus.UNAUTHORIZED.value
    assert response.json == {"token": ["not recognized"]}


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
