from http import HTTPStatus

from server.models import (
    ActivityOption,
    Profile,
    FacultyProfileActivity,
    VerificationEmail,
    VerificationToken,
    save,
)


def test_get_public_tags_needs_authorization(client):
    response = client.get("/api/search-tags")

    assert response.status_code == HTTPStatus.UNAUTHORIZED.value


def test_get_empty_public_tags(client, auth):
    token = "1234"
    verification_email = save(VerificationEmail(email="test@test.com"))

    verification_token = save(
        VerificationToken(token=token, email_id=verification_email.id)
    )

    auth.login(verification_token.token)

    response = client.get("/api/search-tags")

    assert response.status_code == HTTPStatus.OK.value

    assert response.json == {
        "tags": {
            "activities": [],
            "clinical_specialties": [],
            "degrees": [],
            "hospital_affiliations": [],
            "parts_of_me": [],
            "professional_interests": [],
        }
    }


def test_get_public_tags(client, auth):
    token = "1234"
    verification_email = save(VerificationEmail(email="test@test.com"))

    save(VerificationToken(token=token, email_id=verification_email.id))

    profile = save(
        Profile(
            verification_email=verification_email,
            name="Test User",
            cadence="monthly",
            contact_email="user@test.com",
        )
    )

    activity_option = save(ActivityOption(value="activity", public=True))

    save(FacultyProfileActivity(profile=profile, tag=activity_option))

    auth.login(token)

    response = client.get("/api/search-tags")

    assert response.status_code == HTTPStatus.OK.value

    assert response.json == {
        "tags": {
            "activities": ["activity"],
            "clinical_specialties": [],
            "degrees": [],
            "hospital_affiliations": [],
            "parts_of_me": [],
            "professional_interests": [],
        }
    }
