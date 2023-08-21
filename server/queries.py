import operator
from functools import reduce
from typing import List, Optional, Type

from flask_sqlalchemy.query import Query
from sqlalchemy import and_, func, or_, sql

from .models import (
    ActivityOption,
    BaseProfile,
    ClinicalSpecialtyOption,
    DegreeOption,
    FacultyClinicalSpecialty,
    FacultyHospitalAffiliation,
    FacultyPartsOfMe,
    FacultyProfessionalInterest,
    FacultyProfile,
    FacultyProfileActivity,
    FacultyProfileDegree,
    HospitalAffiliationOption,
    PartsOfMeOption,
    ProfessionalInterestOption,
    ProfileStar,
    StudentClinicalSpecialty,
    StudentHospitalAffiliation,
    StudentPartsOfMe,
    StudentPCESiteOption,
    StudentProfessionalInterest,
    StudentProfile,
    StudentProfileActivity,
    StudentProgramOption,
    StudentYearOption,
    VerificationEmail,
    VerificationToken,
    db,
)


def get_verification_email_by_email(email: str) -> Optional[VerificationEmail]:
    return VerificationEmail.query.filter(
        VerificationEmail.email == email
    ).one_or_none()


def get_profile_by_token(
    verification_token: VerificationToken,
) -> Optional[FacultyProfile]:
    verification_email = VerificationEmail.get_by_id(
        verification_token.email_id
    )

    if verification_email.is_faculty:
        return FacultyProfile.query.filter(
            FacultyProfile.verification_email_id == verification_email.id
        ).one_or_none()

    return StudentProfile.query.filter(
        StudentProfile.verification_email_id == verification_email.id
    ).one_or_none()


def _filter_query_on_degrees(degree_list: List[str], query: Query) -> Query:
    regular_degree_filters = [
        degree for degree in degree_list if degree not in ["dmd / dds", "md / do"]
    ]

    # TODO replace this with alias tags
    md_do_filter = (
        [
            func.bool_or(func.lower(DegreeOption.value) == "md")
            | func.bool_or(func.lower(DegreeOption.value) == "do")
        ]
        if "md / do" in degree_list
        else []
    )

    dmd_dds_filter = (
        [
            func.bool_or(func.lower(DegreeOption.value) == "dmd")
            | func.bool_or(func.lower(DegreeOption.value) == "dds")
        ]
        if "dmd / dds" in degree_list
        else []
    )

    degree_filters = (
        [
            func.bool_or(func.lower(DegreeOption.value) == degree)
            for degree in regular_degree_filters
        ]
        + md_do_filter
        + dmd_dds_filter
    )

    degree_filter = reduce(operator.and_, degree_filters)
    return (
        query.outerjoin(FacultyProfileDegree)
        .outerjoin(DegreeOption)
        .group_by(FacultyProfile.id)
        .having(degree_filter)
    )


def _filter_faculty_query_on_affiliations(
    affiliation_list: List[str], query: Query
) -> Query:
    affiliations_filters = reduce(
        operator.and_,
        [
            func.bool_or(func.lower(HospitalAffiliationOption.value) == affilation)
            for affilation in affiliation_list
        ],
    )

    return (
        query.outerjoin(
            FacultyHospitalAffiliation,
            FacultyProfile.id == FacultyHospitalAffiliation.profile_id,
        )
        .outerjoin(HospitalAffiliationOption)
        .group_by(FacultyProfile.id)
        .having(affiliations_filters)
    )


def _filter_student_query_on_affiliations(
    affiliation_list: List[str], query: Query
) -> Query:
    affiliations_filters = reduce(
        operator.and_,
        [
            func.bool_or(func.lower(HospitalAffiliationOption.value) == affilation)
            for affilation in affiliation_list
        ],
    )

    return (
        query.outerjoin(
            StudentHospitalAffiliation,
            StudentProfile.id == StudentHospitalAffiliation.profile_id,
        )
        .outerjoin(HospitalAffiliationOption)
        .group_by(StudentProfile.id)
        .having(affiliations_filters)
    )


def _filter_student_profiles(
    available_profiles: Query,
    words: List[str],
    tags: List[str],
    affiliation_list: List[str],
) -> Query:
    searchable_fields = [
        StudentProfile.name,
        StudentProfile.additional_information,
        StudentProfile.cadence,
    ]

    tag_fields = [
        (StudentClinicalSpecialty, ClinicalSpecialtyOption),
        (StudentProfessionalInterest, ProfessionalInterestOption),
        (StudentPartsOfMe, PartsOfMeOption),
        (StudentProfileActivity, ActivityOption),
    ]

    query = available_profiles

    for relation, option_class in tag_fields:
        query = query.outerjoin(relation).outerjoin(option_class)

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

    tag_filters = [
        or_(
            func.lower(option_class.value) == tag
            for _, option_class in tag_fields
        )  # type: ignore[arg-type]
        for tag in tags
    ]

    query = query.filter(*search_filters, *tag_filters)

    if affiliation_list:
        query = _filter_student_query_on_affiliations(affiliation_list, query)

    return query


def _filter_faculty_profiles(
    available_profiles: Query,
    words: List[str],
    tags: List[str],
    degree_list: List[str],
    affiliation_list: List[str],
) -> Query:
    searchable_fields = [
        FacultyProfile.name,
        FacultyProfile.additional_information,
        FacultyProfile.cadence,
    ]

    tag_fields = [
        (FacultyClinicalSpecialty, ClinicalSpecialtyOption),
        (FacultyProfessionalInterest, ProfessionalInterestOption),
        (FacultyPartsOfMe, PartsOfMeOption),
        (FacultyProfileActivity, ActivityOption),
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

    tag_filters = [
        or_(
            func.lower(option_class.value) == tag
            for _, option_class in tag_fields
        )  # type: ignore[arg-type]
        for tag in tags
    ]

    query = available_profiles

    for relation, option_class in tag_fields:
        query = query.outerjoin(relation).outerjoin(option_class)

    query = query.filter(*search_filters, *tag_filters)

    if degree_list:
        query = _filter_query_on_degrees(degree_list, query)

    # TODO affiliation_list could be changed to be a single value.
    # Mentees are unlikely to be looking for a mentor affiliated with more than
    # 1 specific institution.
    if affiliation_list:
        query = _filter_faculty_query_on_affiliations(affiliation_list, query)

    return query


def query_faculty_profiles_and_stars(verification_email_id: int):
    return query_profiles_and_stars(verification_email_id, profile_class=FacultyProfile)


def query_student_profiles_and_stars(verification_email_id: int):
    return query_profiles_and_stars(verification_email_id, profile_class=StudentProfile)


def query_profiles_and_stars(
    verification_email_id: int, profile_class: Type[BaseProfile]
) -> Query:
    return (
        db.session.query(
            profile_class,
            func.count(ProfileStar.from_verification_email_id).label(
                "profile_star_count"
            ),
        )
        .filter(
            or_(
                profile_class.available_for_mentoring,
                profile_class.verification_email_id == verification_email_id,
            )
        )
        .outerjoin(
            ProfileStar,
            and_(
                ProfileStar.from_verification_email_id == verification_email_id,
                profile_class.verification_email_id
                == ProfileStar.to_verification_email_id,
            ),
        )
        .group_by(profile_class.id)
    )


def matching_student_profiles(
    query: str, tags: str, affiliations: str, verification_email_id: int,
) -> Query:
    profiles_and_stars = query_student_profiles_and_stars(verification_email_id)

    words = "".join(
        character if character.isalnum() else " " for character in query.lower()
    ).split()

    tag_list = tags.lower().split(",") if tags else []
    affiliation_list = affiliations.lower().split(",") if affiliations else []

    filtered_profiles = _filter_student_profiles(
        profiles_and_stars, words, tag_list, affiliation_list,
    )

    return filtered_profiles


def matching_faculty_profiles(
    query: str, tags: str, degrees: str, affiliations: str, verification_email_id: int,
) -> Query:
    profiles_and_stars = query_faculty_profiles_and_stars(verification_email_id)

    words = "".join(
        character if character.isalnum() else " " for character in query.lower()
    ).split()

    tag_list = tags.lower().split(",") if tags else []
    degree_list = degrees.lower().split(",") if degrees else []
    affiliation_list = affiliations.lower().split(",") if affiliations else []

    filtered_profiles = _filter_faculty_profiles(
        profiles_and_stars, words, tag_list, degree_list, affiliation_list,
    )

    return filtered_profiles


def add_stars_to_profiles(profiles_and_stars):
    # TODO do this without mutating profile
    available_profiles = []

    for profile, star_count in profiles_and_stars:
        profile.starred = star_count > 0
        available_profiles.append(profile)

    return available_profiles


def query_value_with_option_type_label(query, tag_class, name):
    return query.with_entities(
        tag_class.value.label("value"),
        sql.expression.literal(name).label("option_type"),
    )


def query_tag_related_to_active_profile(
    tag_class, profile_relation_class, name, profile_class
):
    query = (
        tag_class.query.join(
            profile_relation_class, tag_class.id == profile_relation_class.tag_id
        )
        .outerjoin(
            FacultyProfile, profile_relation_class.profile_id == FacultyProfile.id,
        )
        .outerjoin(
            StudentProfile, profile_relation_class.profile_id == StudentProfile.id,
        )
        .filter(profile_class.available_for_mentoring.is_(True))
    )

    return query_value_with_option_type_label(query, tag_class, name)


def union_queries(queries):
    return queries[0].union(*queries[1:])


def query_tags_with_active_profiles(
    config_tag_classes, public_tag_classes, profile_class
):
    config_tag_queries = [
        query_tag_related_to_active_profile(
            tag_class, profile_relation_class, name, profile_class
        )
        for tag_class, profile_relation_class, name in config_tag_classes
    ]

    public_tag_queries = [
        query_tag_related_to_active_profile(
            tag_class, profile_relation_class, name, profile_class,
        ).filter(tag_class.public.is_(True))
        for tag_class, profile_relation_class, name in public_tag_classes
    ]

    queries = config_tag_queries + public_tag_queries

    select = union_queries(queries)

    cte = select.cte("tags")

    result = db.session.query(
        cte.columns.option_type, func.array_agg(cte.columns.value)
    ).group_by(cte.columns.option_type)

    # Need to default to empty list for each tag type, since tags with no
    # searchable values will not be in the result
    empty_values = {
        name: [] for _, _, name in [*config_tag_classes, *public_tag_classes]
    }

    return {**empty_values, **dict(result)}


def query_profile_tag_classes(config_tag_classes, public_tag_classes):
    config_tag_queries = [
        query_value_with_option_type_label(tag_class.query, tag_class, name)
        for tag_class, name in config_tag_classes
    ]

    public_tag_queries = [
        query_value_with_option_type_label(tag_class.query, tag_class, name).filter(
            tag_class.public.is_(True)
        )
        for tag_class, name in public_tag_classes
    ]

    queries = config_tag_queries + public_tag_queries

    select = union_queries(queries).order_by("value")

    cte = select.cte("tags")

    result = db.session.query(
        cte.columns.option_type, func.array_agg(cte.columns.value)
    ).group_by(cte.columns.option_type)

    # Need to default to empty list for each tag type, since tags with no
    # searchable values will not be in the result
    empty_values = {name: [] for _, name in [*config_tag_classes, *public_tag_classes]}

    return {**empty_values, **dict(result)}


def query_profile_tags():
    config_tag_classes = [
        (HospitalAffiliationOption, "hospital_affiliations"),
        (DegreeOption, "degrees"),
        (StudentProgramOption, "programs"),
        (StudentPCESiteOption, "pce_site_options"),
        (StudentYearOption, "current_year_options"),
    ]

    public_tag_classes = [
        (ActivityOption, "activities"),
        (ClinicalSpecialtyOption, "clinical_specialties"),
        (ProfessionalInterestOption, "professional_interests"),
    ]

    return query_profile_tag_classes(config_tag_classes, public_tag_classes)


def query_faculty_searchable_tags():
    config_tag_classes = [
        (
            HospitalAffiliationOption,
            FacultyHospitalAffiliation,
            "hospital_affiliations",
        ),
        (DegreeOption, FacultyProfileDegree, "degrees"),
    ]

    public_tag_classes = [
        (ActivityOption, FacultyProfileActivity, "activities"),
        (ClinicalSpecialtyOption, FacultyClinicalSpecialty, "clinical_specialties"),
        (PartsOfMeOption, FacultyPartsOfMe, "parts_of_me"),
        (
            ProfessionalInterestOption,
            FacultyProfessionalInterest,
            "professional_interests",
        ),
    ]

    return query_tags_with_active_profiles(
        config_tag_classes, public_tag_classes, profile_class=FacultyProfile
    )


def query_student_searchable_tags():
    config_tag_classes = [
        (
            HospitalAffiliationOption,
            StudentHospitalAffiliation,
            "hospital_affiliations",
        ),
    ]

    public_tag_classes = [
        (ActivityOption, StudentProfileActivity, "activities"),
        (ClinicalSpecialtyOption, StudentClinicalSpecialty, "clinical_specialties"),
        (PartsOfMeOption, StudentPartsOfMe, "parts_of_me"),
        (
            ProfessionalInterestOption,
            StudentProfessionalInterest,
            "professional_interests",
        ),
    ]

    return query_tags_with_active_profiles(
        config_tag_classes, public_tag_classes, profile_class=StudentProfile
    )
