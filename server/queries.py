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


def matching_profiles(query, degrees, affiliations):
    if query is None or query == '' and not degrees and not affiliations:
        return Profile.query.filter(Profile.available_for_mentoring)

    words = ''.join(
        character if character.isalnum() else ' ' for character in query.lower()
    ).split()

    degree_list = degrees.lower().split(',')
    affiliation_list = affiliations.lower().split(',')

    searchable_fields = [Profile.name, Profile.additional_information, Profile.cadence]

    tag_fields = [
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

    if degree_list:
        regular_degree_filters = [
            degree
            for degree in degree_list
            if degree not in ['dmd / dds', 'md / do']
        ]

        md_do_filter = (
            [
                func.bool_or(func.lower(DegreeOption.value) == 'md')
                | func.bool_or(func.lower(DegreeOption.value) == 'do')
            ] if 'md / do' in degree_list else []
        )

        dmd_dds_filter = (
            [
                func.bool_or(func.lower(DegreeOption.value) == 'dmd')
                | func.bool_or(func.lower(DegreeOption.value) == 'dds')
            ] if 'dmd / dds' in degree_list else []
        )

        degree_filters = [
            func.bool_or(func.lower(DegreeOption.value) == degree)
            for degree in regular_degree_filters
        ] + md_do_filter + dmd_dds_filter

        degree_filter = reduce(
            operator.and_,
            degree_filters
        )
        query = (
            query.outerjoin(ProfileDegree)
            .outerjoin(DegreeOption)
            .group_by(Profile.id)
            .having(degree_filter)
        )

    if affiliations:
        affiliations_filters = reduce(
            operator.and_,
            [
                func.bool_or(func.lower(HospitalAffiliationOption.value) == affilation)
                for affilation in affiliation_list
            ],
        )
        query = (
            query.outerjoin(HospitalAffiliation, Profile.id == HospitalAffiliation.profile_id)
            .outerjoin(HospitalAffiliationOption)
            .group_by(Profile.id)
            .having(affiliations_filters)
        )

    return query.filter(*filters)
