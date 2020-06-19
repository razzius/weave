import datetime
import http

from freezegun import freeze_time
from server.models import Profile

from .utils import create_test_profile


MOCK_DATE = datetime.datetime(2019, 10, 21)

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


@freeze_time(MOCK_DATE)
def test_update_profile(client, auth):
    token = "1234"

    profile = create_test_profile(token)

    auth.login(token)

    response = client.put(f"/api/profiles/{profile.id}", json=PROFILE_UPDATE)

    assert response.status_code == http.HTTPStatus.OK.value

    expected_fields = {"contact_email": "new@test.com", "name": "New User"}

    assert expected_fields.items() <= response.json.items()

    profile = Profile.query.first()

    assert profile.date_updated == MOCK_DATE


def test_admin_update_does_not_update_date(client, auth):
    admin_token = "admin"
    create_test_profile(admin_token, email="admin@test.com", is_admin=True)

    profile = create_test_profile("abcd")

    original_profile_date_updated = profile.date_updated

    auth.login(admin_token)
    response = client.put(f"/api/profiles/{profile.id}", json=PROFILE_UPDATE,)

    assert response.status_code == http.HTTPStatus.OK.value

    assert profile.date_updated == original_profile_date_updated


def test_tags_cannot_have_trailing_spaces(client, auth):
    token = "abcd"

    update = {**PROFILE_UPDATE, "clinical_specialties": ["Test "]}

    profile = create_test_profile(token)

    auth.login(token)
    response = client.put(f"/api/profiles/{profile.id}", json=update,)

    assert response.status_code == http.HTTPStatus.OK.value

    assert profile.clinical_specialties[0].tag.value == "Test"
