import datetime
import http

import time_machine

from server.models import FacultyProfile

from .utils import create_test_profile, create_test_verification_token


MOCK_DATE = datetime.datetime(2019, 10, 21, tzinfo=datetime.timezone.utc)

PROFILE_UPDATE = {
    "name": "New User",
    "contact_email": "new@test.com",
    "affiliations": [],
    "clinical_specialties": [],
    "professional_interests": [],
    "parts_of_me": [],
    "activities": [],
    "degrees": [],
}


@time_machine.travel(MOCK_DATE, tick=False)
def test_update_profile(client, auth, db_session):
    profile = create_test_profile()

    token = create_test_verification_token(
        verification_email=profile.verification_email
    )

    auth.login(token.token)

    response = client.put(f"/api/profiles/{profile.id}", json=PROFILE_UPDATE)

    assert response.status_code == http.HTTPStatus.OK.value, response.json

    expected_fields = {"contact_email": "new@test.com", "name": "New User"}

    assert expected_fields.items() <= response.json.items()

    profile = FacultyProfile.query.first()

    assert profile.date_updated == MOCK_DATE


def test_admin_update_does_not_update_date(client, auth, db_session):
    admin_profile = create_test_profile(email="admin@test.com", is_admin=True)

    admin_token = create_test_verification_token(
        verification_email=admin_profile.verification_email
    )

    profile = create_test_profile()

    original_profile_date_updated = profile.date_updated

    auth.login(admin_token.token)

    response = client.put(
        f"/api/profiles/{profile.id}",
        json=PROFILE_UPDATE,
    )

    assert response.status_code == http.HTTPStatus.OK.value

    assert profile.date_updated == original_profile_date_updated


def test_tags_cannot_have_trailing_spaces(client, auth, db_session):
    update = {**PROFILE_UPDATE, "clinical_specialties": ["Test "]}

    profile = create_test_profile()

    token = create_test_verification_token(
        verification_email=profile.verification_email
    )

    auth.login(token.token)

    response = client.put(
        f"/api/profiles/{profile.id}",
        json=update,
    )

    assert response.status_code == http.HTTPStatus.OK.value

    assert profile.clinical_specialties[0].tag.value == "Test"
