import datetime
import http


from .utils import create_test_profile, create_test_verification_token


def test_sort_profiles_by_date_updated(client, auth, db_session):
    own_profile = create_test_profile(
        email="test@test.com",
        name="Own Profile",
        date_updated=datetime.datetime(2018, 1, 1, tzinfo=datetime.timezone.utc),
        available_for_mentoring=True,
    )

    token = create_test_verification_token(
        verification_email=own_profile.verification_email
    )

    recently_updated_profile = create_test_profile(
        email="updated@test.com",
        name="Z",
        date_updated=datetime.datetime(2019, 10, 1, tzinfo=datetime.timezone.utc),
        available_for_mentoring=True,
    )

    not_recently_updated_profile = create_test_profile(
        email="not_updated@test.com",
        name="A",
        date_updated=datetime.datetime(2017, 10, 1, tzinfo=datetime.timezone.utc),
        available_for_mentoring=True,
    )

    auth.login(token.token)

    response = client.get("/api/profiles?sorting=date_updated")

    assert response.status_code == http.HTTPStatus.OK.value

    assert response.json["profile_count"] == 3

    results = response.json["profiles"]

    assert results[0]["id"] == own_profile.id
    assert results[1]["id"] == recently_updated_profile.id
    assert results[2]["id"] == not_recently_updated_profile.id
