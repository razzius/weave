from http import HTTPStatus

from server.models import FacultyProfile, VerificationEmail, VerificationToken, save


def test_set_unavailable_to_mentor(client, auth, db_session):
    token = "123"
    email = "test@test.com"

    verification_email = save(VerificationEmail(email=email, is_faculty=True))

    save(VerificationToken(token=token, email_id=verification_email.id))

    save(
        FacultyProfile(
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

    assert FacultyProfile.query.all()[0].available_for_mentoring is False
