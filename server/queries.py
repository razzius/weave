import operator
from functools import reduce

from .models import Profile
from sqlalchemy import func, or_

from .models import (
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
)


def matching_profiles(query, degrees):
    if query is None or query == '' and not degrees:
        return Profile.query.filter(Profile.available_for_mentoring)

    words = ''.join(
        character if character.isalnum() else ' ' for character in query.lower()
    ).split()

    degree_list = degrees.lower().split(',')

    searchable_fields = [Profile.name, Profile.additional_information, Profile.cadence]

    tag_fields = [
        (HospitalAffiliation, HospitalAffiliationOption),
        (ClinicalSpecialty, ClinicalSpecialtyOption),
        (ProfessionalInterest, ProfessionalInterestOption),
        (PartsOfMe, PartsOfMeOption),
        (ProfileActivity, ActivityOption),
    ]

    search_filters = [
        or_(
            *[func.lower(field).contains(word) for field in searchable_fields]
            + [
                func.lower(option_class.value).contains(word)
                for _, option_class in tag_fields
            ]
        )
        for word in words
    ]

    filters = [Profile.available_for_mentoring, *search_filters]

    query = Profile.query

    for relation, option_class in tag_fields:
        query = query.outerjoin(relation).outerjoin(option_class)

    if degrees:
        degree_filters = reduce(
            operator.and_,
            [
                func.bool_or(func.lower(DegreeOption.value) == degree)
                for degree in degree_list
            ],
        )
        query = (
            query.outerjoin(ProfileDegree)
            .outerjoin(DegreeOption)
            .group_by(Profile.id)
            .having(degree_filters)
        )

    return query.filter(*filters)
