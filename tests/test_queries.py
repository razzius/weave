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
        ActivityOption(value='Activity'),
        ClinicalSpecialtyOption(value='Specialty'),
        DegreeOption(value='Degree'),
        HospitalAffiliationOption(value='Hospital'),
        PartsOfMeOption(value='Part'),
        ProfessionalInterestOption(value='Interest'),
    ]

    for option in options:
        save(option)

    tags = get_all_public_tags()

    assert {tag.value for tag in tags} == {option.value for option in options}


def test_get_all_public_tags_duplicate_tags(db_session):
    options = [
        ActivityOption(value='duplicate'),
        ClinicalSpecialtyOption(value='duplicate'),
    ]

    for option in options:
        save(option)

    tags = get_all_public_tags()

    assert {tag.value for tag in tags} == {'duplicate'}
