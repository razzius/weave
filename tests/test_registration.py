from http import HTTPStatus

from server.models import VerificationEmail

from structlog.testing import capture_logs


def test_faculty_registration_email(client, requests_mock, app, db_session):
    app.config['VALID_DOMAINS'] = ['university.edu']

    email = "test@university.edu"

    requests_mock.post(
        "https://api.sparkpost.com/api/v1/transmissions", {}, reason="OK"
    )

    with capture_logs() as cap_logs:
        response = client.post(
            "/api/send-faculty-verification-email", json={"email": email}
        )
        assert len(cap_logs) >= 1

        # Should log token id
        assert any("token_id" in log for log in cap_logs)

    assert response.json["email"] == email

    verification_email_id = response.json["id"]

    verification_email = VerificationEmail.get_by_id(verification_email_id)

    assert verification_email.email == email


def test_faculty_registration_invalid_email(client, requests_mock):
    requests_mock.post(
        "https://api.sparkpost.com/api/v1/transmissions", {}, reason="OK"
    )

    response = client.post(
        "/api/send-faculty-verification-email", json={"email": "test@test.com"}
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY.value
