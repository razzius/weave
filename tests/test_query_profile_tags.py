from server.models import (
    ActivityOption,
    ClinicalSpecialtyOption,
    DegreeOption,
    FacultyClinicalSpecialty,
    FacultyHospitalAffiliation,
    FacultyPartsOfMe,
    FacultyProfessionalInterest,
    FacultyProfileActivity,
    FacultyProfileDegree,
    HospitalAffiliationOption,
    PartsOfMeOption,
    ProfessionalInterestOption,
    save,
)
from server.queries import query_profile_tags

from .utils import create_test_profile


def test_query_profile_tags_not_related_to_profile(db_session):
    save(HospitalAffiliationOption(value="Hospital"))

    tags = query_profile_tags()

    assert tags == {
        "activities": [],
        "clinical_specialties": [],
        "degrees": [],
        "hospital_affiliations": ["Hospital"],
        "professional_interests": [],
        "programs": [],
        "pce_site_options": [],
        "current_year_options": [],
    }


def test_query_profile_tags(db_session):
    profile = create_test_profile(available_for_mentoring=True)

    options = [
        HospitalAffiliationOption(value="Hospital"),
        DegreeOption(value="Degree"),
        ActivityOption(value="Activity", public=True),
        ClinicalSpecialtyOption(value="Specialty", public=True),
        PartsOfMeOption(value="Part", public=True),
        ProfessionalInterestOption(value="Interest", public=True),
    ]

    relation_classes = [
        FacultyHospitalAffiliation,
        FacultyProfileDegree,
        FacultyProfileActivity,
        FacultyClinicalSpecialty,
        FacultyPartsOfMe,
        FacultyProfessionalInterest,
    ]

    for option in options:
        save(option)

    profile_relations = [
        cls(tag_id=option.id, profile_id=profile.id)
        for cls, option in zip(relation_classes, options)
    ]

    for relation in profile_relations:
        save(relation)

    tags = query_profile_tags()

    assert tags == {
        "activities": ["Activity"],
        "clinical_specialties": ["Specialty"],
        "degrees": ["Degree"],
        "hospital_affiliations": ["Hospital"],
        "professional_interests": ["Interest"],
        "programs": [],
        "pce_site_options": [],
        "current_year_options": [],
    }
