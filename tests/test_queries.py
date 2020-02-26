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


def test_get_all_public_tags_no_tags(db_session):
    tags = get_all_public_tags()

    assert tags == []


def test_get_all_public_tags_one_of_each_tag(db_session):
    options = [
        ActivityOption(value='Activity', public=True),
        ClinicalSpecialtyOption(value='Specialty', public=True),
        DegreeOption(value='Degree', public=True),
        HospitalAffiliationOption(value='Hospital', public=True),
        PartsOfMeOption(value='Part', public=True),
        ProfessionalInterestOption(value='Interest', public=True),
    ]

    for option in options:
        save(option)

    tags = get_all_public_tags()

    assert {tag.value for tag in tags} == {option.value for option in options}


def test_get_all_public_tags_duplicate_tags(db_session):
    options = [
        ActivityOption(value='duplicate', public=True),
        ClinicalSpecialtyOption(value='duplicate', public=True),
    ]

    for option in options:
        save(option)

    tags = get_all_public_tags()

    assert set(tags) == {
        ('duplicate', 'activities'),
        ('duplicate', 'clinical_specialties'),
    }


def test_non_public_tags_excluded(db_session):
    options = [ActivityOption(value='Activity', public=False)]

    for option in options:
        save(option)

    tags = get_all_public_tags()

    assert tags == []
