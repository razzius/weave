from http import HTTPStatus

from server.models import Profile, VerificationEmail, VerificationToken, save


def test_set_unavailable_to_mentor(client, auth):
    token = "123"
    email = "test@test.com"

    verification_email = save(VerificationEmail(email=email))

    save(VerificationToken(token=token, email_id=verification_email.id))

    save(
        Profile(
            name="Test",
            contact_email=email,
            verification_email_id=verification_email.id,
            cadence="monthly",
        )
    )

    auth.login(token)

    data = {"available": False}

    response = client.post("/api/availability", json=data)

    assert response.status_code == HTTPStatus.OK.value
    assert response.json["available"] is False

    assert Profile.query.all()[0].available_for_mentoring is False
