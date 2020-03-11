from typing import Dict, List

from server.models import (
    ActivityOption,
    ClinicalSpecialty,
    ClinicalSpecialtyOption,
    DegreeOption,
    HospitalAffiliation,
    HospitalAffiliationOption,
    PartsOfMe,
    PartsOfMeOption,
    ProfessionalInterest,
    ProfessionalInterestOption,
    ProfileActivity,
    ProfileDegree,
    save,
)
from server.queries import get_all_searchable_tags

from .utils import create_test_profile


EMPTY_TAGS: Dict[str, List[str]] = {
    'activities': [],
    'clinical_specialties': [],
    'degrees': [],
    'hospital_affiliations': [],
    'parts_of_me': [],
    'professional_interests': [],
}


def test_get_all_searchable_tags_no_tags(db_session):
    tags = get_all_searchable_tags()

    assert tags == EMPTY_TAGS


def test_get_all_searchable_tags_one_of_each_tag(db_session):
    profile = create_test_profile()

    options = [
        HospitalAffiliationOption(value='Hospital'),
        DegreeOption(value='Degree'),
        ActivityOption(value='Activity', public=True),
        ClinicalSpecialtyOption(value='Specialty', public=True),
        PartsOfMeOption(value='Part', public=True),
        ProfessionalInterestOption(value='Interest', public=True),
    ]

    relation_classes = [
        HospitalAffiliation,
        ProfileDegree,
        ProfileActivity,
        ClinicalSpecialty,
        PartsOfMe,
        ProfessionalInterest,
    ]

    for option in options:
        save(option)

    profile_relations = [
        cls(tag_id=option.id, profile_id=profile.id)
        for cls, option in zip(relation_classes, options)
    ]

    for relation in profile_relations:
        save(relation)

    tags = get_all_searchable_tags()

    assert tags == {
        'activities': ['Activity'],
        'clinical_specialties': ['Specialty'],
        'degrees': ['Degree'],
        'hospital_affiliations': ['Hospital'],
        'parts_of_me': ['Part'],
        'professional_interests': ['Interest'],
    }


def test_get_all_searchable_tags_duplicate_tags(db_session):
    profile = create_test_profile()

    options = [
        ActivityOption(value='duplicate', public=True),
        ClinicalSpecialtyOption(value='duplicate', public=True),
    ]

    for option in options:
        save(option)

    relation_classes = [ProfileActivity, ClinicalSpecialty]

    profile_relations = [
        cls(tag_id=option.id, profile_id=profile.id)
        for cls, option in zip(relation_classes, options)
    ]

    for relation in profile_relations:
        save(relation)

    tags = get_all_searchable_tags()

    assert tags == {
        **EMPTY_TAGS,
        'activities': ['duplicate'],
        'clinical_specialties': ['duplicate'],
    }


def test_non_public_tags_excluded(db_session):
    options = [ActivityOption(value='Activity', public=False)]

    for option in options:
        save(option)

    tags = get_all_searchable_tags()

    assert tags == EMPTY_TAGS


def test_tags_with_no_profiles_excluded(db_session):
    save(ActivityOption(value='Activity', public=True))

    tags = get_all_searchable_tags()

    assert tags == EMPTY_TAGS
