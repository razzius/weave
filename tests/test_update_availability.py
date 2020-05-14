from http import HTTPStatus

from server.models import db, VerificationEmail, VerificationToken, Profile


def test_set_unavailable_to_mentor(client):
    token = "123"
    email = "test@test.com"

    verification_email = VerificationEmail(email=email)

    db.session.add(verification_email)
    db.session.commit()

    db.session.add(VerificationToken(token=token, email_id=verification_email.id))

    profile = Profile(
        name="Test",
        contact_email=email,
        verification_email_id=verification_email.id,
        cadence="monthly",
    )
    db.session.add(profile)
    db.session.commit()

    data = {"available": False}

    response = client.post(
        "/api/availability", json=data, headers={"Authorization": f"Token {token}"}
    )

    assert response.status_code == HTTPStatus.OK.value
    assert response.json["available"] is False

    assert Profile.query.all()[0].available_for_mentoring is False
