from typing import Dict, List

from server.models import (
    ActivityOption,
    ClinicalSpecialtyOption,
    DegreeOption,
    HospitalAffiliationOption,
    PartsOfMeOption,
    ProfessionalInterestOption,
    save,
)
from server.queries import get_all_public_tags


EMPTY_TAGS: Dict[str, List[str]] = {
    'activities': [],
    'clinical_specialties': [],
    'degrees': [],
    'hospital_affiliations': [],
    'parts_of_me': [],
    'professional_interests': [],
}


def test_get_all_public_tags_no_tags(db_session):
    tags = get_all_public_tags()

    assert tags == EMPTY_TAGS


def test_get_all_public_tags_one_of_each_tag(db_session):
    options = [
        HospitalAffiliationOption(value='Hospital'),
        DegreeOption(value='Degree'),
        ActivityOption(value='Activity', public=True),
        ClinicalSpecialtyOption(value='Specialty', public=True),
        PartsOfMeOption(value='Part', public=True),
        ProfessionalInterestOption(value='Interest', public=True),
    ]

    for option in options:
        save(option)

    tags = get_all_public_tags()

    assert tags == {
        'activities': ['Activity'],
        'clinical_specialties': ['Specialty'],
        'degrees': ['Degree'],
        'hospital_affiliations': ['Hospital'],
        'parts_of_me': ['Part'],
        'professional_interests': ['Interest'],
    }


def test_get_all_public_tags_duplicate_tags(db_session):
    options = [
        ActivityOption(value='duplicate', public=True),
        ClinicalSpecialtyOption(value='duplicate', public=True),
    ]

    for option in options:
        save(option)

    tags = get_all_public_tags()

    assert tags == {
        **EMPTY_TAGS,
        'activities': ['duplicate'],
        'clinical_specialties': ['duplicate'],
    }


def test_non_public_tags_excluded(db_session):
    options = [ActivityOption(value='Activity', public=False)]

    for option in options:
        save(option)

    tags = get_all_public_tags()

    assert tags == EMPTY_TAGS


def test_tags_with_no_profiles_excluded(db_session):
    save(ActivityOption(value='Activity', public=True))

    tags = get_all_public_tags()

    assert tags == EMPTY_TAGS
