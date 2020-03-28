from server.queries import matching_profiles

from .utils import create_test_profile


def test_matching_profiles(db_session):
    profile = create_test_profile(available_for_mentoring=True)

    profiles = matching_profiles(query='', tags='', degrees='', affiliations='')

    assert profiles[0].id == profile.id


def test_matching_profiles_empty(db_session):
    profiles = matching_profiles(query='', tags='', degrees='', affiliations='')

    assert list(profiles) == []
